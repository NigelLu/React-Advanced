/** @format */

import { computeTimeInfo } from "./utils";
import serverTimeManager from "./ServerTimeManager";
import { useEffect, useMemo, useState, useCallback } from "react";
import { setTimeoutInterval } from "../../library/utilities/timeoutInterval/TimeoutInterval";

let countdownTimeIntervalId = null;
let delayToNearestSecondTimerId = null;
let regularRoundingToNearestSecondTimerId = null;
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
const useCountdown = ({ targetTime, interval = 1000, roundToNearestSecondInterval = 60000 }) => {
  // * init the currentTime, ceiling to the nearest second
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

  /**
   * round to the nearest second
   * restart any existing delay/countdown timer
   */
  const roundToNearestSecondAndStartCountdown = useCallback(() => {
    const nearestSecond =
      Math.ceil((serverTimeManager.getLatestOffset() + Date.now() || Date.now()) / 1000) * 1000;
    const delay = nearestSecond - Date.now();

    // * stop previous countdown timerinterval if any
    if (countdownTimeIntervalId) {
      clearTimeout(countdownTimeIntervalId);
      countdownTimeIntervalId = null;
    }

    // * stop previous delay to nearest second timer if any
    if (delayToNearestSecondTimerId) {
      clearTimeout(delayToNearestSecondTimerId);
      delayToNearestSecondTimerId = null;
    }

    // * restart everything
    delayToNearestSecondTimerId = setTimeout(() => {
      setCurrentTime(nearestSecond);
      setTimeoutInterval({
        interval,
        callback: updateCurrentTime,
        timerIdCallback: (newTimerId) => (countdownTimeIntervalId = newTimerId),
      });
    }, delay);
  }, [interval, updateCurrentTime]);

  // TODO: for debugging purposes, REMOVE once finished
  useEffect(() => {
    console.log(currentTime);
    console.log(serverTimeManager.getLatestOffset());
  }, [currentTime]);

  // TODO: 1, re-sync after window freezing; 2, last-X-minute callback; 3, longer-countdown when targetTime is far (even stop countdown when not visible)
  useEffect(() => {
    roundToNearestSecondAndStartCountdown();
    setTimeoutInterval({
      interval: roundToNearestSecondInterval,
      callback: roundToNearestSecondAndStartCountdown,
      timerIdCallback: (newTimerId) => (regularRoundingToNearestSecondTimerId = newTimerId),
    });

    return () => {
      clearTimeout(countdownTimeIntervalId);
      countdownTimeIntervalId = null;
      clearTimeout(delayToNearestSecondTimerId);
      delayToNearestSecondTimerId = null;
      clearTimeout(regularRoundingToNearestSecondTimerId);
      regularRoundingToNearestSecondTimerId = null;
    };
  }, [
    interval,
    updateCurrentTime,
    roundToNearestSecondInterval,
    roundToNearestSecondAndStartCountdown,
  ]);

  return timeInfo;
};

export default useCountdown;
