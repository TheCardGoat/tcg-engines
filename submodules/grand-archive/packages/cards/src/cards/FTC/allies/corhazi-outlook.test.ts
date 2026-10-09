import { describe } from "vitest";
import { corhaziOutlook } from "./corhazi-outlook.ts";

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers rw8qq1uwq8-a1 */
describe("corhaziOutlook — entry counters", () => {
  proveOnEnterCounter({
    card: corhaziOutlook,
    abilityId: "rw8qq1uwq8-a1",
    counter: "preparation",
    amount: 1,
    self: false,
  });
});
