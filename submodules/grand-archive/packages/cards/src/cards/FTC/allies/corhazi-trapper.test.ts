import { describe } from "vitest";
import { corhaziTrapper } from "./corhazi-trapper.ts";

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers sdbzr5zs29-a1 */
describe("corhaziTrapper — entry counters", () => {
  proveOnEnterCounter({
    card: corhaziTrapper,
    abilityId: "sdbzr5zs29-a1",
    counter: "preparation",
    amount: 1,
    self: false,
  });
});

import { proveTargetAttackReduction } from "../../../testing/target-attack-reduction.ts";
/** @covers sdbzr5zs29-a2 */
describe("corhaziTrapper attack reduction", () => {
  proveTargetAttackReduction(corhaziTrapper, "preparation", "sdbzr5zs29-a2");
});
