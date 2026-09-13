import { describe } from "vitest";
import { channelingStone } from "./channeling-stone.ts";
import { proveNextActivationDiscount } from "../../../testing/next-activation-discount.ts";
/** @covers EBWWwvSxr3-a1 */
describe("channeling-stone next activation", () => {
  proveNextActivationDiscount({
    card: channelingStone,
    abilityId: "EBWWwvSxr3-a1",
    amount: 2,
    beastOnly: false,
  });
});
