import { describe } from "vitest";
import { greenSlime } from "./green-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers zgcxyky280-a1 */
describe("Green Slime Pride", () => {
  provePrideAlly({ card: greenSlime, power: 2, pride: 3, reserveCost: 3 });
});

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers zgcxyky280-a2 */
describe("greenSlime — entry counters", () => {
  proveOnEnterCounter({
    card: greenSlime,
    abilityId: "zgcxyky280-a2",
    counter: "buff",
    amount: 2,
    self: true,
  });
});
