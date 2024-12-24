/** @format */
import { setTimeoutInterval } from "../../library/utilities/timeoutInterval/TimeoutInterval";
import { getTimeStampFromServer } from "./utils";

class ServerTimeManager {
  #timerId = null;
  #fetchServerTime;
  #serverTime = null;
  #lastFetched = null;
  #latestOffset = null;

  constructor({ fetchServerTime }) {
    this.#fetchServerTime = fetchServerTime;
    this.getAndUpdateServerTime();
    setTimeoutInterval({
      callback: this.getAndUpdateServerTime.bind(this),
      interval: 10000,
      timerIdCallback: this.setTimerId.bind(this),
    });
  }

  getAndUpdateServerTime() {
    this.#fetchServerTime().then(({ serverTime, whenFetched }) => {
      this.#serverTime = serverTime;
      this.#lastFetched = whenFetched;
      if (this.#serverTime && this.#lastFetched)
        this.#latestOffset = this.#serverTime - this.#lastFetched;
    });
  }

  getServerTime() {
    if (this.#serverTime === null)
      console.warn(
        "ServerTimeManager: 'null' serverTime returned as the ServerTimeManager has not been able to fetch time stamp from server",
      );
    return this.#serverTime;
  }

  getLastFetched() {
    if (this.#lastFetched === null)
      console.warn(
        "ServerTimeManager: 'null' lastFetched timestamp returned as the ServerTimeManager has not been able to fetch time stamp from server",
      );
    return this.#lastFetched;
  }

  getLatestOffset() {
    if (this.#latestOffset === null)
      console.warn(
        "ServerTimeManager: 'null' latestOffset returned as the ServerTimeManager has not been able to fetch time stamp from server",
      );
    return this.#latestOffset;
  }

  setTimerId(newTimerId) {
    this.#timerId = newTimerId;
  }

  getTimerId() {
    if (this.#timerId === null)
      console.warn(
        "ServerTimeManager: 'null' timerId returned as the ServerTimeManager has not started",
      );
    return this.#timerId;
  }
}

const serverTimeManager = new ServerTimeManager({ fetchServerTime: getTimeStampFromServer });

export default serverTimeManager;
