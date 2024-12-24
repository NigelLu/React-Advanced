/** @format */

import "./Countdown.css";
import React, { useState } from "react";
import useCountdown from "./useCountdown";

/**
 * @param {number} targetTime - countdown's target/deadline time, in milliseconds since Jan 1st, 1970, UTC, default to 1 minute after current time
 * @returns
 */
const Countdown = ({ targetTime }) => {
  const timeInfo = useCountdown({
    targetTime,
    onBeforeEndConfig: { threshold: 3585000, callback: () => setColor("red") },
  });
  const [color, setColor] = useState("#1976d2");

  return (
    <>
      <h2>Demo 1-hour Countdown</h2>
      <br />
      <div className='countdown-container'>
        {!timeInfo.end ? (
          <div className='countdown-timer'>
            <span className='time-segment' style={{ color }}>
              {timeInfo.days}d{" "}
            </span>
            <span className='time-segment' style={{ color }}>
              {timeInfo.hoursStr}h{" "}
            </span>
            <span className='time-segment' style={{ color }}>
              {timeInfo.minutesStr}m{" "}
            </span>
            <span className='time-segment' style={{ color }}>
              {timeInfo.secondsStr}s
            </span>
          </div>
        ) : (
          <div className='countdown-ended'>Time's up!</div>
        )}
      </div>
    </>
  );
};

export default Countdown;
