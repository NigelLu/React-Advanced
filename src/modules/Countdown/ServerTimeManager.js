/** @format */
import { getTimeStampFromServer } from "./utils";
import { setTimeoutInterval } from "../../library/utilities/timeoutInterval/TimeoutInterval";

class ServerTimeManager {
  #timerId = null;
  #fetchServerTime;
  #serverTime = null;
  #lastFetched = null;
  #latestOffset = null;

  constructor({ fetchServerTime, fetchInterval = 60000 }) {
    this.#fetchServerTime = fetchServerTime;
    this.getAndUpdateServerTime();
    setTimeoutInterval({
      interval: fetchInterval,
      timerIdCallback: this.setTimerId.bind(this),
      callback: this.getAndUpdateServerTime.bind(this),
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
const getLatestOffset = serverTimeManager.getLatestOffset.bind(serverTimeManager);

export { serverTimeManager, getLatestOffset };
