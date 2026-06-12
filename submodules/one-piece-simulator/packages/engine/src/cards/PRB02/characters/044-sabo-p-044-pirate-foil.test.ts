import { describe, test } from "vite-plus/test";
import { prb02SaboP044PirateFoil044 } from "../../../../../cards/src/cards/PRB02/characters/044-sabo-p-044-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-044 Sabo - P-044 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboP044PirateFoil044);
  });
});
