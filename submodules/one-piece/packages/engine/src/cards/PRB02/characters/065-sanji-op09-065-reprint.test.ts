import { describe, test } from "vite-plus/test";
import { prb02SanjiOp09065Reprint065 } from "../../../../../cards/src/cards/PRB02/characters/065-sanji-op09-065-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-065 Sanji - OP09-065 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SanjiOp09065Reprint065);
  });
});
