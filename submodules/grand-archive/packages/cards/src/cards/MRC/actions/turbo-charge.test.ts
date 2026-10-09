import { describe } from "vitest";
import { turboCharge } from "./turbo-charge.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { proveAdditionalPaymentDraw } from "../../../testing/additional-payment-draw.ts";

/** @covers cnqsm3n9yv-a1
 * @covers cnqsm3n9yv-a2
 */
describe("turboCharge payment and draw", () => {
  proveAdditionalPaymentDraw({ card: turboCharge, paymentCard: powercell });
});
