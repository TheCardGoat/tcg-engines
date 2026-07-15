import { describe, test } from "vite-plus/test";
import { prb01SanjiPrb01001001 } from "../../../../../cards/src/cards/PRB01/leaders/001-sanji-prb01-001.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB01-001 Sanji (PRB01-001)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SanjiPrb01001001);
  });
});
