import { describe, test } from "vite-plus/test";
import { prb01SatoriJollyRogerFoil105 } from "../../../../../cards/src/cards/PRB01/characters/105-satori-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-105 Satori (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SatoriJollyRogerFoil105);
  });
});
