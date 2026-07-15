import { describe, test } from "vite-plus/test";
import { prb02SanjiSt21003PirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-sanji-st21-003-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST21-003 Sanji - ST21-003 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SanjiSt21003PirateFoil003);
  });
});
