import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { quickstepTreads } from "./quickstep-treads.ts";

/** @covers rZ6LEFqqIS-a1 */
describe("Quickstep Treads — entry draw", () => {
  proveOnEnterDraw({
    card: quickstepTreads,
    abilityId: "rZ6LEFqqIS-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
