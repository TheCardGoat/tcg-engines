import { describe, test } from "vite-plus/test";
import { prb02KoalaPirateFoil069 } from "../../../../../cards/src/cards/PRB02/characters/069-koala-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-069 Koala (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02KoalaPirateFoil069);
  });
});
