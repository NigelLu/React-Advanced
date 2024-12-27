/** @format */
import client from "../../library/common/axios/client";

/**
 * @param {number} timeNumber - the time in number format (can be hour/minute/second)
 * @param {boolean} isMilliseconds - indicates if the timeNumber to format is for milliseconds, default false
 * @returns {string} - the formatted string version of the time number (e.g., 6 would become "06")
 */

function formatTime(timeNumber, isMilliseconds = false) {
  const fullFormattedTime = String(timeNumber).padStart(2 + isMilliseconds, "0");
  return isMilliseconds ? fullFormattedTime[0] : fullFormattedTime;
}

/**
 *
 * @returns {Object} - server's timestamp and the time when the timestamp was fetched
 * {
 *   serverTime: <int> || null,
 *   whenFetched: <int> || null,
 * }
 */
async function getTimeStampFromServer() {
  const startTime = Date.now();
  const serverTime = await client
    .get("server-time")
    .then((res) => res.data?.serverTime || null)
    .catch((_err) => null);
  const endTime = Date.now();

  return {
    serverTime: serverTime ? serverTime + Math.round((endTime - startTime) / 2) : null,
    whenFetched: serverTime ? endTime : null,
  };
}

const ZERO_TIME_INFO = {
  day: 0,
  hours: 0,
  hoursStr: "00",
  minutes: 0,
  minutesStr: "00",
  seconds: 0,
  secondsStr: "00",
  milliseconds: 0,
  millisecondsStr: "000",
  end: true,
};

/**
 *
 * @param {int} targetTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC
 * @param {int} currentTime - current time, in milliseconds since Jan 1st, 1970, UTC
 * @param {boolean} showSeconds - whether to return secondsStr
 * @returns
 */
function computeTimeInfo({ targetTime, currentTime, showSeconds = false }) {
  const timeRemaining = targetTime - currentTime;
  if (timeRemaining <= 0) {
    return ZERO_TIME_INFO;
  }

  // step-by-step, calculate the total seconds, minutes, hours, and days in "remaining time"
  const secondsTotal = Math.floor(timeRemaining / 1000);
  const minutesTotal = Math.floor(secondsTotal / 60);
  const hoursTotal = Math.floor(minutesTotal / 60);
  const days = Math.floor(hoursTotal / 24);

  // based on previous calculations, calculate the milliseconds, seconds, minutes, and hours for display
  const milliseconds = timeRemaining % 1000;
  const seconds = secondsTotal % 60;
  const minutes = minutesTotal % 60;
  const hours = hoursTotal % 24;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    hoursStr: formatTime(hours),
    minutesStr: formatTime(minutes),
    secondsStr: showSeconds ? formatTime(seconds) : null,
    end: false,
  };
}

export { ZERO_TIME_INFO, getTimeStampFromServer, formatTime, computeTimeInfo };
