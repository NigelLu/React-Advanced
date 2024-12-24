/** @format */

import { computeTimeInfo } from "./utils";
import serverTimeManager from "./ServerTimeManager";
import { useEffect, useMemo, useState, useCallback } from "react";
import { setTimeoutInterval } from "../../library/utilities/timeoutInterval/TimeoutInterval";

let countdownTimeIntervalId = null;
let delayToNearestSecondTimerId = null;
let regularRoundingToNearestSecondTimerId = null;
const clearTimers = () => {
  clearTimeout(countdownTimeIntervalId);
  countdownTimeIntervalId = null;
  clearTimeout(delayToNearestSecondTimerId);
  delayToNearestSecondTimerId = null;
  clearTimeout(regularRoundingToNearestSecondTimerId);
  regularRoundingToNearestSecondTimerId = null;
};

/**
 * self-defined hook to manage logic related to timeInfo state update
 *
 * @param {int} targetTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC
 * @param {int} interval - update frequency for the timeInfo computed state
 * @param {int} roundToNearestSecondInterval - number of milliseconds before each round to nearest second attempt
 * @param {Object} onBeforeEndConfig - { threshold: <number_of_milliseconds_before_end>, callback: <function> }
 *
 * @returns {Object} - timeInfo state, an object indicating the timeInfo state, refer to ./utils.js for more
 */
const useCountdown = ({
  targetTime,
  interval = 1000,
  roundToNearestSecondInterval = 60000,
  onBeforeEndConfig = { threshold: 60000, callback: null },
}) => {
  // * init the currentTime, ceiling to the nearest second
  const [currentTime, setCurrentTime] = useState(
    serverTimeManager.getLatestOffset() + Date.now() || Date.now(),
  );
  const [callbackTriggered, setCallbackTriggered] = useState(
    typeof onBeforeEndConfig?.callback !== "function",
  ); // * if no callback given, then default to true

  // * computed property for timeInfo
  const timeInfo = useMemo(
    () => computeTimeInfo({ targetTime, currentTime }),
    [currentTime, targetTime],
  );

  /**
   * update currentTime callback
   */
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

  const startCountdown = useCallback(() => {
    roundToNearestSecondAndStartCountdown();
    setTimeoutInterval({
      interval: roundToNearestSecondInterval,
      callback: roundToNearestSecondAndStartCountdown,
      timerIdCallback: (newTimerId) => (regularRoundingToNearestSecondTimerId = newTimerId),
    });
  }, [roundToNearestSecondAndStartCountdown, roundToNearestSecondInterval]);

  // TODO: for debugging purposes, REMOVE once finished
  useEffect(() => {
    console.log(currentTime);
    console.log(serverTimeManager.getLatestOffset());
  }, [currentTime]);

  // TODO: 1, longer-countdown when targetTime is far
  useEffect(() => {
    startCountdown();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearTimers();
      } else if (document.visibilityState === "visible") {
        startCountdown();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startCountdown]);

  // * trigger callback based on onBeforeEndConfig
  useEffect(() => {
    if (callbackTriggered || !timeInfo || timeInfo.end) return;

    const timeRemaining = targetTime - currentTime;
    if (timeRemaining <= onBeforeEndConfig.threshold) {
      onBeforeEndConfig.callback();
      setCallbackTriggered(true);
    }
  }, [callbackTriggered, currentTime, onBeforeEndConfig, targetTime, timeInfo]);

  return timeInfo;
};

export default useCountdown;
