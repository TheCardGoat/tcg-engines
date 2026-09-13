import { describe } from "vitest";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
import { focusingRound } from "./focusing-round.ts";

/** @covers 7yacwhzzfb-a1 */
describe("Focusing Round — entry draw", () => {
  proveOnEnterDraw({
    card: focusingRound,
    abilityId: "7yacwhzzfb-a1",
    cost: { kind: "reserve", amount: 3 },
  });
});

/** @covers 7yacwhzzfb-a2 */
describe("Focusing Round — load", () => {
  proveLoadBullet({ card: focusingRound, abilityId: "7yacwhzzfb-a2", reserveCost: 2 });
});
