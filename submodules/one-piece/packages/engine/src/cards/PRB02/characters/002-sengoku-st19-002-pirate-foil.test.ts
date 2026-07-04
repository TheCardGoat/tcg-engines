import { describe, test } from "vite-plus/test";
import { prb02SengokuSt19002PirateFoil002 } from "../../../../../cards/src/cards/PRB02/characters/002-sengoku-st19-002-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST19-002 Sengoku - ST19-002 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SengokuSt19002PirateFoil002);
  });
});
