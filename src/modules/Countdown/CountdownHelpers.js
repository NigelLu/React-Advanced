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
 * @param {number} targetTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC
 * @param {boolean} showMilliseconds - whether to show milliseconds in the countdown
 * @returns
 */
function computeTimeInfo(targetTime, showMilliseconds) {
  const now = Date.now();
  const remainingTime = targetTime - now;

  if (remainingTime <= 0) {
    return ZERO_TIME_INFO;
  }

  // step-by-step, calculate the total seconds, minutes, hours, and days in "remaining time"
  const secondsTotal = Math.floor(remainingTime / 1000);
  const minutesTotal = Math.floor(secondsTotal / 60);
  const hoursTotal = Math.floor(minutesTotal / 60);
  const days = Math.floor(hoursTotal / 24);

  // based on previous calculations, calculate the milliseconds, seconds, minutes, and hours for display
  const milliseconds = remainingTime % 1000;
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
    secondsStr: formatTime(seconds),
    millisecondsStr: showMilliseconds ? formatTime(milliseconds, true) : undefined,
    end: false,
  };
}

function getServerTimeOffset(useRTT = true) {
  const t0 = Date.now();
  return client.get("server-time").then((res) => {
    const t1 = Date.now();
    const RTT = t1 - t0;
    const offset = res.data.serverTime - t1 + useRTT ? RTT / 2 : 0;
    return { offset };
  });
}

export { ZERO_TIME_INFO, computeTimeInfo, getServerTimeOffset };
