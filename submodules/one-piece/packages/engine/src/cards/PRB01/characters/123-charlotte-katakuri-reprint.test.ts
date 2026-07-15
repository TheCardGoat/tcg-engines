import { describe, test } from "vite-plus/test";
import { prb01CharlotteKatakuriReprint123 } from "../../../../../cards/src/cards/PRB01/characters/123-charlotte-katakuri-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-123 Charlotte Katakuri (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CharlotteKatakuriReprint123);
  });
});
