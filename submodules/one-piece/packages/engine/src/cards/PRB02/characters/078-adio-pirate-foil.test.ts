import { describe, test } from "vite-plus/test";
import { prb02AdioPirateFoil078 } from "../../../../../cards/src/cards/PRB02/characters/078-adio-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-078 Adio (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02AdioPirateFoil078);
  });
});
