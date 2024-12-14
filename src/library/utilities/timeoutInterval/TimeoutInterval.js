/** @format */

export function setTimeoutInterval(callback, interval = 1000, timerIdCallback) {
  const now = Date.now();
  let intervalCount = 0;
  let timerId = null;

  function countdownWithLocalCorrection() {
    const offset = Math.max(Date.now() - (now + interval * intervalCount++), 500); // * correct offsets no bigger than 500ms
    const nextInterval = interval - offset;

    timerId = setTimeout(() => {
      countdownWithLocalCorrection();
      callback();
    }, nextInterval);

    timerIdCallback(timerId);
  }

  countdownWithLocalCorrection();
}

export class TimeoutInterval {
  static nextCallbackId = 0;

  #callbacks = [];
  #timerId = null;
  #interval = 1000;

  constructor(interval = 1000) {
    // * make sure argument "interval" is valid
    if (typeof interval !== "number") {
      console.error("TimeoutInterval: please supply an integer as interval");
    } else {
      this.#interval = interval;
    }
  }

  start() {
    setTimeoutInterval(
      () => {
        this.#callbacks.forEach(({ callback }) => callback());
      },
      this.#interval,
      (timerId) => (this.#timerId = timerId),
    );
  }

  stop() {
    clearTimeout(this.#timerId);
    this.#timerId = null;
  }

  add(callback, optionalName = null) {
    if (typeof callback !== "function") {
      console.error("TimeoutInterval.add: please supply a function as calllback");
      return;
    }

    const nextId = TimeoutInterval.nextCallbackId++;
    this.#callbacks.push({ id: nextId, callback, name: optionalName });

    return nextId;
  }

  removeByCallbackId(callbackId) {
    const callbackIdx = this.#callbacks.findIndex((ele) => ele.id === callbackId);

    if (callbackIdx === -1) {
      console.warn(`TimeoutInterval.removeByCallbackId: ${callbackId} is not a valid callback Id`);
      return false;
    }

    this.#callbacks.splice(callbackIdx, 1);

    if (!this.#callbacks.length) this.stop();

    return true;
  }

  // * will only remove the first occurrence of the callback that has the specified name
  removeByCallbackName(callbackName) {
    const callbackIdx = this.#callbacks.findIndex(({ name }) => name === callbackName);

    if (callbackIdx === -1) {
      console.warn(
        `TimeoutInterval.removeByCallbackName: ${callbackName} is not a valid callback name`,
      );
      return false;
    }

    this.#callbacks.splice(callbackIdx, 1);

    if (!this.#callbacks.length) this.stop();

    return true;
  }

  removeAll() {
    this.stop();
    this.#callbacks.length = 0; // * empty the callback array
  }

  getTimerId() {
    if (this.#timerId === null)
      console.warn(
        "TimeoutInterval: 'null' timerId returned as the TimeoutInterval has not started",
      );
    return this.#timerId;
  }

  getInterval() {
    return this.#interval;
  }
}
