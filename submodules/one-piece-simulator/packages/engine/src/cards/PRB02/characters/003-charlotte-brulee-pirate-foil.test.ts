import { describe, test } from "vite-plus/test";
import { prb02CharlotteBruleePirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-charlotte-brulee-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST20-003 Charlotte Brulee (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CharlotteBruleePirateFoil003);
  });
});
