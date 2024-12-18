/** @format */

import "./Countdown.css";
import React from "react";
import useCountdown from "./useCountdown";

/**
 * @param {number} targetDate - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC, default to 1 minute after current time
 * @returns
 */
const Countdown = ({ targetDate, showMilliseconds = true }) => {
  const timeInfo = useCountdown({ deadlineTime: targetDate, showMilliseconds });

  return (
    <>
      <h2>Demo 1-hour Countdown</h2>
      <br />
      <div className='countdown-container'>
        {!timeInfo.end ? (
          <div className='countdown-timer'>
            <span className='time-segment'>{timeInfo.days}d </span>
            <span className='time-segment'>{timeInfo.hoursStr}h </span>
            <span className='time-segment'>{timeInfo.minutesStr}m </span>
            <span className='time-segment'>{timeInfo.secondsStr}s</span>
            {showMilliseconds ? (
              <span className='time-segment'>{timeInfo.millisecondsStr}</span>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className='countdown-ended'>Time's up!</div>
        )}
      </div>
    </>
  );
};

export default Countdown;
