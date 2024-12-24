/** @format */

/**
 *
 * @param {function} callback - the callback to be called for each interval
 * @param {int} interval - number of milliseconds between each call (interval)
 * @param {function} timerIdCallback - the callback to obtain and update the timerId after each new setTimeout
 */
export function setTimeoutInterval({ callback, interval = 1000, timerIdCallback }) {
  const now = Date.now();
  let intervalCount = 0;
  let timerId = null;

  function countdown() {
    const offset = Math.max(Date.now() - (now + interval * intervalCount++), 800); // * correct offsets no bigger than 800 ms

    const nextInterval = interval - offset;

    timerId = setTimeout(() => {
      countdown();
      callback();
    }, nextInterval);

    timerIdCallback(timerId);
  }

  countdown();
}

// export class TimeoutInterval {
//   static nextCallbackId = 0;

//   #callbacks = []; // * array of callbacks to call at each interval
//   #timerId = null; // * attribute to store the timerId for the latest setTimeout
//   #interval = 1000; // * the length of interval in milliseconds
//   #now = null; // * time now (corrected with server timestamp)
//   #targetTime = null;
//   #serverTime = null;

//   constructor(interval = 1000, targetTime) {
//     // * make sure arguments are valid
//     if (typeof interval !== "number") {
//       console.error("TimeoutInterval: please supply an integer as interval");
//     } else {
//       this.#interval = interval;
//     }

//     if (typeof targetTime !== "number") {
//       console.error("TimeoutInterval: please supply an integer as interval");
//     } else {
//       this.#targetTime = targetTime;
//     }
//   }

//   /**
//    * start the interval
//    */
//   start() {
//     setTimeoutInterval({
//       callback: () => {
//         this.#callbacks.forEach(({ callback }) => callback());
//       },
//       targetTime: this.#targetTime,
//       interval: this.#interval,
//       timerIdCallback: (timerId) => (this.#timerId = timerId),
//       currentTimeCallback: (currentTime) => (this.#now = currentTime),
//       fetchServerTimeStamp: this.getServerTime,
//       stopTimeoutInterval: this.stop,
//     });
//   }

//   /**
//    * stop the interval and clear the #timerId
//    */
//   stop() {
//     clearTimeout(this.#timerId);
//     this.#timerId = null;
//   }

//   /**
//    *
//    * @param {function} callback - a callback function to call at each interval
//    * @param {string} optionalName - optional name for the callback function (can be used to search the callback)
//    * @returns {int} - the Id for the callback that was just added
//    */
//   add(callback, optionalName = null) {
//     if (typeof callback !== "function") {
//       console.error("TimeoutInterval.add: please supply a function as calllback");
//       return;
//     }

//     const nextId = TimeoutInterval.nextCallbackId++;
//     this.#callbacks.push({ id: nextId, callback, name: optionalName });

//     return nextId;
//   }

//   /**
//    *
//    * @param {int} callbackId - remove a callback by Id, the Id is a self-incremeting field of the TimeoutInterval class
//    * @returns - if the removal is successful
//    */
//   removeByCallbackId(callbackId) {
//     const callbackIdx = this.#callbacks.findIndex((ele) => ele.id === callbackId);

//     if (callbackIdx === -1) {
//       console.warn(`TimeoutInterval.removeByCallbackId: ${callbackId} is not a valid callback Id`);
//       return false;
//     }

//     this.#callbacks.splice(callbackIdx, 1);

//     if (!this.#callbacks.length) this.stop();

//     return true;
//   }

//   /**
//    *
//    * @param {string} callbackName
//    * NOTE: will only remove the first occurrence of the callback that has the specified name
//    * @returns - if the removal is successful
//    */
//   removeByCallbackName(callbackName) {
//     const callbackIdx = this.#callbacks.findIndex(({ name }) => name === callbackName);

//     if (callbackIdx === -1) {
//       console.warn(
//         `TimeoutInterval.removeByCallbackName: ${callbackName} is not a valid callback name`,
//       );
//       return false;
//     }

//     this.#callbacks.splice(callbackIdx, 1);

//     if (!this.#callbacks.length) this.stop();

//     return true;
//   }

//   /**
//    * remove all callbacks and stop the interval
//    */
//   removeAll() {
//     this.stop();
//     this.#callbacks.length = 0; // * empty the callback array
//   }

//   /**
//    *
//    * @returns {int} - return the latest timerId
//    */
//   getTimerId() {
//     if (this.#timerId === null)
//       console.warn(
//         "TimeoutInterval: 'null' timerId returned as the TimeoutInterval has not started/has stopped",
//       );
//     return this.#timerId;
//   }

//   /**
//    *
//    * @returns {int} - return the current time timestamp
//    */
//   getCurrentTime() {
//     if (this.#now === null)
//       console.warn(
//         "TimeoutInterval: 'null' currentTime returned as the TimeoutInterval has not started/has stopped",
//       );
//     return this.#now;
//   }

//   /**
//    *
//    * @returns {int} - return the interval length
//    */
//   getInterval() {
//     return this.#interval;
//   }

//   /**
//    *
//    * @param {int} serverTime - the server timestamp to set
//    */
//   setServerTime(serverTime) {
//     this.#serverTime = serverTime;
//   }

//   /**
//    *
//    * @returns {int} - the server timestamp
//    */
//   getServerTime() {
//     if (this.#serverTime === null) console.warn("TimeoutInterval: 'null' serverTime returned");
//     return this.#serverTime;
//   }
// }
