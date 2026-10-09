import { describe } from "vitest";
import { doubledPawns } from "./doubled-pawns.ts";
import { pawnPiece } from "../../PTM/tokens/pawn-piece.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers OQVvVANhJh-a1 */
describe("doubledPawns", () => {
  proveSummonAction({ card: doubledPawns, cost: 3, tokens: [{ card: pawnPiece, count: 2 }] });
});
