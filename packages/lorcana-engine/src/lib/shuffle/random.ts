/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import type { AleaState } from "./random.alea";
import { alea } from "./random.alea";

export interface RandomState {
  seed: string | number;
  prngstate?: AleaState;
}

export interface RandomAPI {
  D4(): number;
  D4(diceCount: number): number[];
  D6(): number;
  D6(diceCount: number): number[];
  D10(): number;
  D10(diceCount: number): number[];
  D12(): number;
  D12(diceCount: number): number[];
  D20(): number;
  D20(diceCount: number): number[];
  Die(spotvalue?: number): number;
  Die(spotvalue: number, diceCount: number): number[];
  Number(): number;
  Shuffle<T>(deck: T[]): T[];
}

export interface PrivateRandomAPI {
  _private: {
    isUsed(): boolean;
    getState(): RandomState;
  };
}

/**
 * Random
 *
 * Calls that require a pseudorandom number generator.
 * Uses a seed from ctx, and also persists the PRNG
 * state in ctx so that moves can stay pure.
 */
export class Random {
  state: RandomState;
  used: boolean;

  /**
   * Generates a new seed from the current date / time.
   */
  static seed() {
    return Date.now()
      .toString(36)
      .slice(-10)
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  constructor(state?: RandomState) {
    // If we are on the client, the seed is not present.
    // Just use a temporary seed to execute the move without
    // crashing it. The move state itself is discarded,
    // so the actual value doesn't matter.
    this.state = state || { seed: Random.seed() };
    this.used = false;
  }

  isUsed() {
    return this.used;
  }

  getState() {
    return this.state;
  }

  /**
   * Generate a random number.
   */
  _random() {
    this.used = true;

    const R = this.state;

    const seed = R.prngstate ? "" : R.seed;
    const rand = alea(seed, R.prngstate);

    const number = rand();

    if (typeof rand.state === "function") {
      this.state = {
        ...R,
        prngstate: rand.state(),
      };
    }

    return number;
  }

  api(): RandomAPI & PrivateRandomAPI {
    const random: Random["_random"] = this._random.bind(this);

    const SpotValue = {
      D4: 4,
      D6: 6,
      D8: 8,
      D10: 10,
      D12: 12,
      D20: 20,
    };

    type DieFn = {
      (): number;
      (diceCount: number): number[];
    };

    // Generate functions for predefined dice values D4 - D20.
    const predefined = {} as Record<keyof typeof SpotValue, DieFn>;
    for (const key in SpotValue) {
      // @ts-ignore
      const spotvalue = SpotValue[key];
      // @ts-ignore
      predefined[key] = (diceCount?: number) => {
        return diceCount === undefined
          ? Math.floor(random() * spotvalue) + 1
          : Array.from({ length: diceCount }).map(
              () => Math.floor(random() * spotvalue) + 1,
            );
      };
    }

    function Die(spotValue?: number): number;
    function Die(spotValue: number, diceCount: number): number[];
    function Die(spotvalue = 6, diceCount?: number) {
      return diceCount === undefined
        ? Math.floor(random() * spotvalue) + 1
        : Array.from({ length: diceCount }).map(
            () => Math.floor(random() * spotvalue) + 1,
          );
    }

    return {
      /**
       * Similar to Die below, but with fixed spot values.
       * Supports passing a diceCount
       *    if not defined, defaults to 1 and returns the value directly.
       *    if defined, returns an array containing the random dice values.
       *
       * D4: (diceCount) => value
       * D6: (diceCount) => value
       * D8: (diceCount) => value
       * D10: (diceCount) => value
       * D12: (diceCount) => value
       * D20: (diceCount) => value
       */
      ...predefined,

      /**
       * Roll a die of specified spot value.
       *
       * @param {number} spotvalue - The die dimension (default: 6).
       * @param {number} diceCount - number of dice to throw.
       *                             if not defined, defaults to 1 and returns the value directly.
       *                             if defined, returns an array containing the random dice values.
       */
      Die,

      /**
       * Generate a random number between 0 and 1.
       */
      Number: () => {
        return random();
      },

      /**
       * Shuffle an array.
       *
       * @param {Array} deck - The array to shuffle. Does not mutate
       *                       the input, but returns the shuffled array.
       */
      Shuffle: <T>(deck: T[]) => {
        const clone = [...deck];
        let sourceIndex = deck.length;
        let destinationIndex = 0;
        const shuffled = Array.from<T>({ length: sourceIndex });

        while (sourceIndex) {
          const randomIndex = Math.trunc(sourceIndex * random());
          // @ts-ignore
          shuffled[destinationIndex++] = clone[randomIndex];
          // @ts-ignore
          clone[randomIndex] = clone[--sourceIndex];
        }

        return shuffled;
      },

      _private: this,
    };
  }
}

// https://stackoverflow.com/a/47593316/1310623

// // Create cyrb128 state:
// var seed = cyrb128("apples");
// // Four 32-bit component hashes provide the seed for sfc32.
// var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
//
// // Only one 32-bit component hash is needed for mulberry32.
// var rand = mulberry32(seed[0]);
//
// // Obtain sequential random numbers like so:
// rand();
// rand();

// export function cyrb128(str) {
//   let h1 = 1779033703,
//     h2 = 3144134277,
//     h3 = 1013904242,
//     h4 = 2773480762;
//   for (let i = 0, k; i < str.length; i++) {
//     k = str.charCodeAt(i);
//     h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
//     h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
//     h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
//     h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
//   }
//   h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
//   h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
//   h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
//   h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
//   (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
//   return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
// }

// export function sfc32(a, b, c, d) {
//   return function () {
//     a >>>= 0;
//     b >>>= 0;
//     c >>>= 0;
//     d >>>= 0;
//     var t = (a + b) | 0;
//     a = b ^ (b >>> 9);
//     b = (c + (c << 3)) | 0;
//     c = (c << 21) | (c >>> 11);
//     d = (d + 1) | 0;
//     t = (t + d) | 0;
//     c = (c + t) | 0;
//     return (t >>> 0) / 4294967296;
//   };
// }
//
// export function mulberry32(a) {
//   return function () {
//     var t = (a += 0x6d2b79f5);
//     t = Math.imul(t ^ (t >>> 15), t | 1);
//     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }
//
// export function xoshiro128ss(a, b, c, d) {
//   return function () {
//     var t = b << 9,
//       r = b * 5;
//     r = ((r << 7) | (r >>> 25)) * 9;
//     c ^= a;
//     d ^= b;
//     b ^= c;
//     a ^= d;
//     c ^= t;
//     d = (d << 11) | (d >>> 21);
//     return (r >>> 0) / 4294967296;
//   };
// }
