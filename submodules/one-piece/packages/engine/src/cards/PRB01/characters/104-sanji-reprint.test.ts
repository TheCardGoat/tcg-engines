import { describe, test } from "vite-plus/test";
import { prb01SanjiReprint104 } from "../../../../../cards/src/cards/PRB01/characters/104-sanji-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-104 Sanji (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SanjiReprint104);
  });
});
