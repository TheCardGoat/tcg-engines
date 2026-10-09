import { describe } from "vitest";
import { winblessLookout } from "./winbless-lookout.ts";

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers oqcHHAmYCW-a1 */
describe("winblessLookout — entry counters", () => {
  proveOnEnterCounter({
    card: winblessLookout,
    abilityId: "oqcHHAmYCW-a1",
    counter: "preparation",
    amount: 1,
    self: false,
  });
});

import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
/** @covers oqcHHAmYCW-a2 */
describe("winblessLookout class Glimpse", () => {
  for (const classBonus of [false, true])
    proveGlimpsePlay({
      card: winblessLookout,
      cost: { kind: "reserve", amount: 2 },
      count: 1,
      classRestricted: true,
      classBonus,
      preparation: 1,
    });
});
