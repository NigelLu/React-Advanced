/** @format */

import { useEffect, useState } from "react";
import client from "../../library/common/axios/client";
import { ZERO_TIME_INFO, computeTimeInfo } from "./CountdownHelpers";

function getServerTimeOffset(useRTT = true) {
  const t0 = Date.now();
  return client.get("server-time").then((res) => {
    const t1 = Date.now();
    const RTT = t1 - t0;
    const offset = res.data.serverTime - t1 + useRTT ? RTT / 2 : 0;
    return { offset };
  });
}

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
    getServerTimeOffset();
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
