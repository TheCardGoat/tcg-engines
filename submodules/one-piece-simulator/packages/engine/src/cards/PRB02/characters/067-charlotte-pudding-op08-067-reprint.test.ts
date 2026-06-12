import { describe, test } from "vite-plus/test";
import { prb02CharlottePuddingOp08067Reprint067 } from "../../../../../cards/src/cards/PRB02/characters/067-charlotte-pudding-op08-067-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-067 Charlotte Pudding - OP08-067 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CharlottePuddingOp08067Reprint067);
  });
});
