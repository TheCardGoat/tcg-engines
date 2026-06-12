import { describe, test } from "vite-plus/test";
import { prb02SanjiReprint064 } from "../../../../../cards/src/cards/PRB02/characters/064-sanji-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-064 Sanji (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SanjiReprint064);
  });
});
