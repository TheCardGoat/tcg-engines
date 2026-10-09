import { describe } from "vitest";
import { diaoChanEnchantress } from "./diao-chan-enchantress.ts";

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers 00xbh8oc00-a1 */
describe("diaoChanEnchantress — entry counters", () => {
  proveOnEnterCounter({
    card: diaoChanEnchantress,
    abilityId: "00xbh8oc00-a1",
    counter: "named:glimmer",
    amount: 2,
    self: true,
  });
});
