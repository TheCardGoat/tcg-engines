import { describe } from "vitest";
import { memoryInvocation } from "./memory-invocation.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { proveAdditionalPaymentDraw } from "../../../testing/additional-payment-draw.ts";

/** @covers io7maIjC4u-a1
 * @covers io7maIjC4u-a2
 */
describe("memoryInvocation payment and draw", () => {
  proveAdditionalPaymentDraw({
    card: memoryInvocation,
    paymentCard: reclaim,
    paymentZone: "graveyard",
  });
});
