import { describe, test } from "vite-plus/test";
import { prb02SanjiP068PirateFoil068 } from "../../../../../cards/src/cards/PRB02/characters/068-sanji-p-068-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-068 Sanji - P-068 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SanjiP068PirateFoil068);
  });
});
