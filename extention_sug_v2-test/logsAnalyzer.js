const logsAnalyzer = (doc, lessonDate, lessonInfo) => {
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

        //console.log("объект - ", lessonObject);
        return lessonObject;
      }
    }
  };

  const windowLesson = createWindowLesson(doc);
  const loki = new Loki(windowLesson);
  const logs = loki.getLogs();
  logs.then((result) => {
    const fullLogs = result;
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

    const sortLogsByDateTime = (a, b) => {
      const dateTimeA = new Date(a.dateTime);
      const dateTimeB = new Date(b.dateTime);
      return dateTimeA - dateTimeB;
    };

    const formatLessonDate = moment(lessonDate).format("HH:mm:ss D MMM(Z)");
    const beforeLessonDate = moment(lessonDate).subtract(15, "minutes").format("HH:mm:ss D MMM(Z)");
    const endLessonDate = moment(lessonDate).add(Number(lessonInfo.durationLesson), "minutes").format("HH:mm:ss D MMM(Z)");

    const filterLogsInLesson = (fullLogs) => {
      fullLogs.sort((a, b) => sortLogsByDateTime(a, b));
      return fullLogs.filter(log => {
        return log.dateTime >= beforeLessonDate && log.dateTime <= endLessonDate;
      });
    };

    const pupilLogsLesson = filterLogsInLesson(pupilFullLogs);
    const tutorLogsLesson = filterLogsInLesson(tutorFullLogs);

    //console.log("Логи У с учетом 15 мин до урока: ", pupilLogsLesson);
    //console.log("Логи П с учетом 15 мин до урока: ", tutorLogsLesson);

    const checkLogs = (logs) => {

      const dateTransform = (dateTime) => {
        return moment(dateTime, "HH:mm:ss DD MMM Z").format("D MMMM [в] HH:mm:ss");
      };

      const beginDate = logs[0].dateTime;
      const endDate = logs[logs.length - 1].dateTime;

      const info = {
        beginDate: "",
        endDate: dateTransform(endDate),
        timeCountInLesson: 0,
        camera: "",
        micro: "",
        ws_closed: 0
      };

      if (beginDate < formatLessonDate && endDate > formatLessonDate) {
        info.beginDate = dateTransform(formatLessonDate);
      } else {
        info.beginDate = dateTransform(beginDate);
      }

      if (endDate > formatLessonDate) {
        const timeCount = moment(endDate, "HH:mm:ss D MMM(Z)").diff(moment(beginDate, "HH:mm:ss D MMM(Z)"), "minutes");
        info.timeCountInLesson = timeCount;
      }

      logs.forEach(log => {
        switch (log.msgKey) {
          case "no_camera_permission":
            info.camera = "Нет разрешений камеры";
            break;
          case "no_camera":
            info.camera = "Камера физически отсутствует";
            break;
          case "no_microphone_permission":
            info.micro = "Нет разрешений микрофона";
            break;
          case "no_microphone":
            info.micro = "Микрофон физически отсутствует";
            break;
          case "ws_closed":
            info.ws_closed++;
            break;
        }
      });
      return info;

    };

    //console.log(`Действия У на уроке: `, checkLogs(pupilFullLogs));
    //console.log(`Действия П на уроке: `, checkLogs(tutorFullLogs));

    lessonInfo.fullLogs = {
      pupil: checkLogs(pupilLogsLesson),
      tutor: checkLogs(tutorLogsLesson)
    };

    return;

  });
};