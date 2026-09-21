import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { titheProclamation } from "./tithe-proclamation.ts";

/** @covers q8sdbzr5zs-a1 */
describe("Tithe Proclamation — entry draw", () => {
  proveOnEnterDraw({
    card: titheProclamation,
    abilityId: "q8sdbzr5zs-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
