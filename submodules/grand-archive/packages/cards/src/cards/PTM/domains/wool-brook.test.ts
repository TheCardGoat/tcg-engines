import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { woolBrook } from "./wool-brook.ts";

/** @covers lcCGyyNGuM-a2 */
describe("Wool Brook — entry draw", () => {
  proveOnEnterDraw({
    card: woolBrook,
    abilityId: "lcCGyyNGuM-a2",
    cost: { kind: "reserve", amount: 4 },
    destination: "memory",
  });
});

import { proveSelfEntryCounters } from "../../../testing/self-entry-counters.ts";

/** @covers lcCGyyNGuM-a1 */
describe("woolBrook — entry counters", () => {
  proveSelfEntryCounters(woolBrook, "named:refinement", 1);
});
