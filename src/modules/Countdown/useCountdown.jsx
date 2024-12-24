/** @format */

import { computeTimeInfo } from "./utils";
import serverTimeManager from "./ServerTimeManager";
import { useEffect, useMemo, useState, useCallback } from "react";
import { setTimeoutInterval } from "../../library/utilities/timeoutInterval/TimeoutInterval";

let timerId = null;
/**
 * self-defined hook to manage logic related to timeInfo state update
 *
 * @param {int} targetTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC
 * @param {int} interval - update frequency for the timeInfo computed state
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
const useCountdown = ({ targetTime, interval = 1000 }) => {
  const [currentTime, setCurrentTime] = useState(
    serverTimeManager.getLatestOffset() + Date.now() || Date.now(),
  );
  // * computed property for timeInfo
  const timeInfo = useMemo(
    () => computeTimeInfo({ targetTime, currentTime }),
    [currentTime, targetTime],
  );

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(serverTimeManager.getLatestOffset() + Date.now() || Date.now());
  }, []);

  // TODO: 1, auto-adjust to the nearest second; 2, re-sync after window freezing; 3, last-X-minute callback; 4, longer-countdown when targetTime is far (even stop countdown when not visible)
  useEffect(() => {
    setTimeoutInterval({
      interval,
      callback: updateCurrentTime,
      timerIdCallback: (newTimerId) => (timerId = newTimerId),
    });

    return () => clearTimeout(timerId);
  });

  return timeInfo;
};

export default useCountdown;
