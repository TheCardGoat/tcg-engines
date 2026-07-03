import { describe, test } from "vite-plus/test";
import { prb02RoronoaZoroSt14013PirateFoil013 } from "../../../../../cards/src/cards/PRB02/characters/013-roronoa-zoro-st14-013-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST14-013 Roronoa Zoro - ST14-013 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RoronoaZoroSt14013PirateFoil013);
  });
});
