import { describe } from "vitest";
import { gearstrideGloves } from "./gearstride-gloves.ts";

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers lcb6jhxctx-a1 */
describe("gearstrideGloves — entry counters", () => {
  proveOnEnterCounter({
    card: gearstrideGloves,
    abilityId: "lcb6jhxctx-a1",
    counter: "preparation",
    amount: 1,
    self: false,
  });
});
