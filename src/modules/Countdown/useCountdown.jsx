/** @format */

import { computeTimeInfo } from "./utils";
import { useEffect, useMemo, useState, useCallback } from "react";
import { setTimeoutInterval } from "../../library/utilities/timeoutInterval/TimeoutInterval";

let countdownTimeIntervalId = null;
let delayToNearestSecondTimerId = null;
let nearEndCallbackTimerId = null;
let regularRoundingToNearestSecondTimerId = null;
const clearCountdownTimers = () => {
  clearTimeout(countdownTimeIntervalId);
  countdownTimeIntervalId = null;
  clearTimeout(delayToNearestSecondTimerId);
  delayToNearestSecondTimerId = null;
  clearTimeout(regularRoundingToNearestSecondTimerId);
  regularRoundingToNearestSecondTimerId = null;
};
const clearNearEndCallbackTimerId = () => {
  clearTimeout(nearEndCallbackTimerId);
  nearEndCallbackTimerId = null;
};
const defaultGetServerOffset = () => 0;

/**
 * self-defined hook to manage logic related to timeInfo state update
 *
 * @param {int} targetTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC
 * @param {function} nearEndCallback - optional callback to execute when the time remaining is within nearEndThreshold
 * @param {int} nearEndThreshold - threshold in milliseconds before targe time for nearEnd callbacks and update interval to take effect
 * @param {boolean} nearEndShowSeconds - whether to show seconds string when the countdown is near the end
 * @param {int} nearEndUpdateInterval - update frequency in milliseconds, when the countdown is within the threshold
 * @param {int} roundToNearestSecondInterval - number of milliseconds before each round to nearest second attempt
 * @param {function} getLatestServerOffset - function to get the latest server offset in milliseconds
 * @param {Object} updateFrequencyConfig - updateInterval config { updateInterval: <num_milliseconds>, showSeconds: <bool> }
 *
 * @returns {Object} - timeInfo state, an object indicating the timeInfo state, refer to ./utils.js for more
 */
const useCountdown = ({
  targetTime,
  nearEndCallback = null,
  nearEndThreshold = 60000,
  nearEndShowSeconds = true,
  nearEndUpdateInterval = 1000,
  roundToNearestSecondInterval = 60000,
  getLatestServerOffset = defaultGetServerOffset,
  updateFrequencyConfig = { updateInterval: 60000, showSeconds: false },
}) => {
  // * init the currentTime, ceiling to the nearest second
  const [currentTime, setCurrentTime] = useState(
    getLatestServerOffset() + Date.now() || Date.now(),
  );
  const [updateInterval, setUpdateInterval] = useState(
    targetTime - currentTime <= nearEndThreshold
      ? nearEndUpdateInterval
      : updateFrequencyConfig.updateInterval,
  );
  const [showSeconds, setShowSeconds] = useState(
    targetTime - currentTime <= nearEndThreshold
      ? nearEndShowSeconds
      : updateFrequencyConfig.showSeconds,
  );

  // * computed property for timeInfo
  const timeInfo = useMemo(
    () => computeTimeInfo({ targetTime, currentTime, showSeconds }),
    [currentTime, showSeconds, targetTime],
  );

  /**
   * update currentTime callback
   */
  const updateCurrentTime = useCallback(() => {
    setCurrentTime(getLatestServerOffset() + Date.now() || Date.now());
  }, [getLatestServerOffset]);

  /**
   * round to the nearest second
   * restart any existing delay/countdown timer
   */
  const roundToNearestSecondAndStartCountdown = useCallback(() => {
    // * stop previous timers if any
    clearTimeout(countdownTimeIntervalId);
    countdownTimeIntervalId = null;
    clearTimeout(delayToNearestSecondTimerId);
    delayToNearestSecondTimerId = null;

    // * compute the delay
    const nearestSecond =
      Math.ceil((getLatestServerOffset() + Date.now() || Date.now()) / 1000) * 1000;
    const delay = nearestSecond - Date.now();

    // * restart everything
    delayToNearestSecondTimerId = setTimeout(() => {
      setCurrentTime(nearestSecond);
      setTimeoutInterval({
        updateInterval,
        callback: updateCurrentTime,
        timerIdCallback: (newTimerId) => (countdownTimeIntervalId = newTimerId),
      });
    }, delay);
  }, [getLatestServerOffset, updateInterval, updateCurrentTime]);

  /**
   * callback to start countdown
   */
  const startCountdown = useCallback(() => {
    roundToNearestSecondAndStartCountdown();
    setTimeoutInterval({
      interval: roundToNearestSecondInterval,
      callback: roundToNearestSecondAndStartCountdown,
      timerIdCallback: (newTimerId) => (regularRoundingToNearestSecondTimerId = newTimerId),
    });
  }, [roundToNearestSecondAndStartCountdown, roundToNearestSecondInterval]);

  /**
   * effect to start the countdown
   */
  useEffect(() => {
    startCountdown();
    return clearCountdownTimers;
  }, [startCountdown]);

  /**
   * effect to add handlers to deal with visibility changes
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearCountdownTimers();
      } else if (document.visibilityState === "visible") {
        startCountdown();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startCountdown]);

  /**
   * effect to perform actions when countdown is near end
   * 1, update updateInterval config when time reached the threshold specified in onNearEndConfig
   * 2, call the nearEnd callback if any
   */
  useEffect(() => {
    const now = getLatestServerOffset() + Date.now() || Date.now();
    if (targetTime - now > nearEndThreshold) {
      nearEndCallbackTimerId = setTimeout(
        () => {
          setUpdateInterval(nearEndUpdateInterval);
          setShowSeconds(nearEndShowSeconds);
          if (typeof nearEndCallback === "function") nearEndCallback();
        },
        targetTime - now - nearEndThreshold,
      );
    } else {
      if (typeof nearEndCallback === "function") nearEndCallback();
    }
    return clearNearEndCallbackTimerId;
  }, [
    targetTime,
    nearEndCallback,
    nearEndThreshold,
    nearEndShowSeconds,
    getLatestServerOffset,
    nearEndUpdateInterval,
  ]);
  return timeInfo;
};

export default useCountdown;
