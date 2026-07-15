import { describe, test } from "vite-plus/test";
import { prb02BrookSt14010PirateFoil010 } from "../../../../../cards/src/cards/PRB02/characters/010-brook-st14-010-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST14-010 Brook - ST14-010 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BrookSt14010PirateFoil010);
  });
});
