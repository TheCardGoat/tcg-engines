import { describe, test } from "vite-plus/test";
import { prb02KillerPirateFoil039 } from "../../../../../cards/src/cards/PRB02/characters/039-killer-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-039 Killer (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02KillerPirateFoil039);
  });
});
