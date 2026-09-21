import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { scepterOfFascination } from "./scepter-of-fascination.ts";

/** @covers 4864k12no2-a1 */
describe("Scepter of Fascination — entry draw", () => {
  proveOnEnterDraw({
    card: scepterOfFascination,
    abilityId: "4864k12no2-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
