import { describe } from "vitest";
import { hornOfBeastcalling } from "./horn-of-beastcalling.ts";
import { proveNextActivationDiscount } from "../../../testing/next-activation-discount.ts";
/** @covers 6e7lRnczfL-a1 */
describe("horn-of-beastcalling next activation", () => {
  proveNextActivationDiscount({
    card: hornOfBeastcalling,
    abilityId: "6e7lRnczfL-a1",
    amount: 3,
    beastOnly: true,
  });
});
