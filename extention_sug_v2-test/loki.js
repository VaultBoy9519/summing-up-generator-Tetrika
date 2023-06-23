const LokiAuth = {
  DOMAIN: "loki.k8s.tetrika-school.ru",
  USERNAME: "loki",
  PASSWORD: "tR98eTgwIRt0f6DopvTp3b4i"
};

const LOGS_LIMIT = 5000;

class Loki {
  constructor(windowLesson) {
    const { startTime, endTime } = windowLesson;

    this.logsQuery = `{host="https://tetrika-school.ru", group="front"} |= "lessons/${windowLesson.id}"`;

    this.logsUrl = `https://${LokiAuth.DOMAIN}/loki/api/v1/query_range?start=${startTime}&end=${endTime}&limit=${LOGS_LIMIT}&query=${this.logsQuery}`;
  }

  logsQuery;

  logsUrl;

  logsAdapter = async (logsData) => {
    const { data } = await logsData;

    return data.result.reduce((accum, { values }) => {
      const transformedLogs = values.map((logData) => {
        const result = JSON.parse(logData[1]).message;
        const timeZone = moment().utcOffset() / 60;

        result.data = JSON.parse(result.data);
        result.dateTime = moment
          .parseZone(result.timestamp)
          .utcOffset(timeZone)
          .format("HH:mm:ss D MMM(Z)");

        return result;
      });

      return [...accum, ...transformedLogs];
    }, []);
  };

  getLogs = async () => {
    const headers = new Headers();
    headers.append("Authorization", `Basic ${btoa(`${LokiAuth.USERNAME}:${LokiAuth.PASSWORD}`)}`);

    const res = await fetch(this.logsUrl, {
      method: "GET",
      headers
    });

    const logs = await this.logsAdapter(res.json());

    return logs;
  };
}
