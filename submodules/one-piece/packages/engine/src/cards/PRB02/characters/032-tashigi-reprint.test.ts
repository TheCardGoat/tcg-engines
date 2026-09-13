import { describe, test } from "vite-plus/test";
import { prb02TashigiReprint032 } from "../../../../../cards/src/cards/PRB02/characters/032-tashigi-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-032 Tashigi (Reprint)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TashigiReprint032);
  });
});
