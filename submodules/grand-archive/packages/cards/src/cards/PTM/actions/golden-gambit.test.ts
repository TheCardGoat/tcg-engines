import { describe } from "vitest";
import { goldenGambit } from "./golden-gambit.ts";
import { pawnPiece } from "../../PTM/tokens/pawn-piece.ts";
import { proveAdditionalPaymentDraw } from "../../../testing/additional-payment-draw.ts";

/** @covers B1EbF6jcYF-a2
 * @covers B1EbF6jcYF-a3
 */
describe("goldenGambit payment and draw", () => {
  proveAdditionalPaymentDraw({ card: goldenGambit, paymentCard: pawnPiece });
});
