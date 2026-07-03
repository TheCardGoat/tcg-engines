import { describe, test } from "vite-plus/test";
import { prb02BartolomeoPirateFoil031 } from "../../../../../cards/src/cards/PRB02/characters/031-bartolomeo-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-031 Bartolomeo (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BartolomeoPirateFoil031);
  });
});
