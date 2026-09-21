import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { bandOfBurningVerdict } from "./band-of-burning-verdict.ts";

/** @covers 7mmve2l328-a1 */
describe("Band of Burning Verdict — entry draw", () => {
  proveOnEnterDraw({
    card: bandOfBurningVerdict,
    abilityId: "7mmve2l328-a1",
    cost: { kind: "memory", amount: 2 },
  });
});
