import { describe, test } from "vite-plus/test";
import { prb02CrocodileP082PirateFoil082 } from "../../../../../cards/src/cards/PRB02/characters/082-crocodile-p-082-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-082 Crocodile - P-082 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CrocodileP082PirateFoil082);
  });
});
