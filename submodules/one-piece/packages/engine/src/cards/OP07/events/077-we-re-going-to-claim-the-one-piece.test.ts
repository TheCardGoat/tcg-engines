import { describe, test } from "vite-plus/test";
import { op07WeReGoingToClaimTheOnePiece077 } from "../../../../../cards/src/cards/events/op07-077-we-re-going-to-claim-the-one-piece.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-077 We're Going to Claim the One Piece!!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07WeReGoingToClaimTheOnePiece077);
  });
});
