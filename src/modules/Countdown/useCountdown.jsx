/** @format */

import { useEffect, useState } from "react";
import { ZERO_TIME_INFO, computeTimeInfo } from "./CountdownHelpers";
/**
 * self-defined hook to manage logic related to timeInfo state update
 *
 * @param {number} deadlineTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC
 * @param {boolean} showMilliseconds - whether to return millisecondsStr in timeInfo state
 * @returns {Object} - timeInfo state, an object indicating the timeInfo state, similar to the one below
 * {
 *   day: 0,
 *   hours: 0,
 *   hoursStr: "00",
 *   minutes: 0,
 *   minutesStr: "00",
 *   seconds: 0,
 *   secondsStr: "00",
 *   milliseconds: 0,
 *   millisecondsStr: "000",
 *   end: true,
 * }
 */
const useCountdown = ({ deadlineTime, showMilliseconds }) => {
  const [timeInfo, setTimeInfo] = useState(ZERO_TIME_INFO);

  useEffect(() => {
    const interval = setInterval(
      () => {
        const newTimeInfo = computeTimeInfo(deadlineTime, showMilliseconds || true);
        setTimeInfo(newTimeInfo);
        if (newTimeInfo.end) {
          clearInterval(interval);
        }
      },
      showMilliseconds ? 100 : 1000,
    );

    return () => clearInterval(interval); // cleanup function for removing the interval upon unmounting
  }, [deadlineTime, showMilliseconds]);

  return timeInfo;
};

export default useCountdown;
