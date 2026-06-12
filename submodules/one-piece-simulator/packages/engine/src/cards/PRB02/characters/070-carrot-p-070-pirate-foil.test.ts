import { describe, test } from "vite-plus/test";
import { prb02CarrotP070PirateFoil070 } from "../../../../../cards/src/cards/PRB02/characters/070-carrot-p-070-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-070 Carrot - P-070 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CarrotP070PirateFoil070);
  });
});
