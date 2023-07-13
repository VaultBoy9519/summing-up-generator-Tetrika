const logsAnalyzer = async (
  doc,
  lessonDate,
  lessonInfo,
  pupilEvents,
  tutorEvents
) => {
  const createWindowLesson = (doc) => {
    const scriptTags = doc.getElementsByTagName("script");
    for (let i = 0; i < scriptTags.length; i++) {
      const scriptContent = scriptTags[i].textContent;
      if (scriptContent.includes("window.lesson")) {
        const startIndex = scriptContent.indexOf("{");
        const endIndex = scriptContent.indexOf("}") + 1;
        const lessonObjectString = scriptContent.substring(startIndex, endIndex);
        const quotedStr = lessonObjectString.replace(/([a-zA-Z0-9_]+)(\s*):/g, "\"$1\":");
        const updatedStr = quotedStr.replace(/'([^']+)'/g, "\"$1\"");

        const lessonObject = JSON.parse(updatedStr);

        return lessonObject;
      }
    }
  };

  const windowLesson = createWindowLesson(doc);
  const loki = new Loki(windowLesson);
  const logs = loki.getLogs();
  const processLogs = async () => {
    const fullLogs = await logs;
    //console.log(fullLogs);

    const pupilFullLogs = [];
    const tutorFullLogs = [];

    function UserLogObj(dateTime, msgKey, role) {
      this.dateTime = dateTime;
      this.msgKey = msgKey;
      this.role = role;
    };

    fullLogs.forEach(logObj => {
      if (logObj.user.role === "pupil") {
        pupilFullLogs.push(new UserLogObj(logObj.dateTime, logObj.msgKey, logObj.user.role));
      } else if (logObj.user.role === "tutor") {
        tutorFullLogs.push(new UserLogObj(logObj.dateTime, logObj.msgKey, logObj.user.role));
      }
    });

    const beforeLessonDate = moment(lessonDate).subtract(15, "minutes").format("HH:mm:ss D MMM(Z)");
    const endLessonDate = moment(lessonDate).add(Number(lessonInfo.durationLesson), "minutes").format("HH:mm:ss D MMM(Z)");


    const filterLogsInLesson = (fullLogs) => {
      const sortLogsByDateTime = (a, b) => {
        const dateTimeA = new Date(a.dateTime);
        const dateTimeB = new Date(b.dateTime);
        return dateTimeA - dateTimeB;
      };
      //console.log(`fullLogs: `, fullLogs);
      if (fullLogs.length > 0) {
        fullLogs.sort((a, b) => sortLogsByDateTime(a, b));

        return fullLogs.filter(log => {

          const dateTime = moment(log.dateTime, "HH:mm:ss D MMM(Z)").toISOString();
          const beforeTime = moment(beforeLessonDate, "HH:mm:ss D MMM(Z)").toISOString();
          const endTime = moment(endLessonDate, "HH:mm:ss D MMM(Z)").toISOString();

          return dateTime >= beforeTime && dateTime <= endTime;
        });
      } else {
        return fullLogs;
      }
    };

    const pupilLogsLesson = filterLogsInLesson(pupilFullLogs);
    const tutorLogsLesson = filterLogsInLesson(tutorFullLogs);

    // console.log("Логи У с учетом 15 мин до урока: ", pupilLogsLesson[0], pupilLogsLesson[pupilLogsLesson.length - 1]);
    // console.log("Логи П с учетом 15 мин до урока: ", tutorLogsLesson[0], tutorLogsLesson[tutorLogsLesson.length - 1]);

    const checkLogs = (logs, events) => {

      const dateTransform = (dateTime) => {
        return moment(dateTime, "HH:mm:ss DD MMM Z").format("HH:mm:ss");
      };

      const info = {
        beginDate: "",
        endDate: "",
        timeCountInLesson: 0,
        camera: "",
        micro: "",
        ws_closed: 0,
        clickButtonTp: 0
      };

      const formatLessonDate = moment(lessonDate).format("HH:mm:ss D MMM(Z)");
      const filterEvents = events.length > 0 ? filterLogsInLesson(events) : [];

      const setTimeCount = (beginDate, endDate) => {
        const calcTimeCount = (beginDate, endDate) => {

          const timeCount = moment(endDate, "HH:mm:ss D MMM(Z)").diff(moment(beginDate, "HH:mm:ss D MMM(Z)"), "minutes");
          info.timeCountInLesson = timeCount;
        };

        if (beginDate >= formatLessonDate && endDate > formatLessonDate) {
          calcTimeCount(beginDate, endDate);
        } else if (beginDate < formatLessonDate && endDate > formatLessonDate) {
          calcTimeCount(formatLessonDate, endDate);
        }
      };

      if (logs.length > 0) {
        let beginDate;
        let endDate;
        if (filterEvents.length > 0) {
          beginDate = filterEvents[0].dateTime < logs[0].dateTime ?
            filterEvents[0].dateTime < formatLessonDate ?
              formatLessonDate :
              filterEvents[0].dateTime :
            logs[0].dateTime;
          endDate = filterEvents[filterEvents.length - 1].dateTime > logs[logs.length - 1].dateTime ?
            filterEvents[filterEvents.length - 1].dateTime :
            logs[logs.length - 1].dateTime;
        } else {
          beginDate = logs[0].dateTime > formatLessonDate ? logs[0].dateTime : formatLessonDate;
          endDate = logs[logs.length - 1].dateTime;
        }

        if (beginDate < formatLessonDate && endDate > formatLessonDate) {
          info.beginDate = dateTransform(formatLessonDate);
        } else {
          info.beginDate = dateTransform(beginDate);
        }

        info.endDate = dateTransform(endDate);

        setTimeCount(beginDate, endDate);

        filterEvents.forEach(event => {
          if (event.description === "На уроке возникли технические сложности!") {
            info.clickButtonTp++;
          }
        });

        logs.forEach(log => {
          switch (log.msgKey) {
            case "no_camera_permission":
              info.camera = "Нет доступа";
              break;
            case "no_camera":
              info.camera = "Отсутствует";
              break;
            case "no_microphone_permission":
              info.micro = "Нет доступа";
              break;
            case "no_microphone":
              info.micro = "Отсутствует";
              break;
            case "ws_closed":
              info.ws_closed++;
              break;
          }
        });
      } else if (filterEvents.length > 0) {
        const beginDate = filterEvents[0].dateTime > formatLessonDate ? filterEvents[0].dateTime : formatLessonDate;
        const endDate = filterEvents[filterEvents.length - 1].dateTime;
        info.beginDate = dateTransform(beginDate);
        info.endDate = dateTransform(endDate);

        setTimeCount(beginDate, endDate);

      } else {
        console.log(`Логи отсутствуют`);
      }

      return info;

    };

    // //console.log(`Действия У на уроке: `, checkLogs(pupilFullLogs));
    // //console.log(`Действия П на уроке: `, checkLogs(tutorFullLogs));

    lessonInfo.pupilLogs = checkLogs(pupilLogsLesson, pupilEvents);
    lessonInfo.tutorLogs = checkLogs(tutorLogsLesson, tutorEvents);

    return;

  };

  await processLogs()
    .then(() => {
      // console.log(`Получилось`);
    })
    .catch((error) => {
      console.log(error);
    });

};