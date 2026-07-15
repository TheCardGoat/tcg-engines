import { describe, test } from "vite-plus/test";
import { prb02SanjiOp06119Reprint119 } from "../../../../../cards/src/cards/PRB02/characters/119-sanji-op06-119-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-119 Sanji - OP06-119 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SanjiOp06119Reprint119);
  });
});
