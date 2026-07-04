import { describe, test } from "vite-plus/test";
import { prb01TonyTonyChopperSt01006JollyRogerFoil006 } from "../../../../../cards/src/cards/PRB01/characters/006-tony-tony-chopper-st01-006-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST01-006 Tony Tony.Chopper (ST01-006) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TonyTonyChopperSt01006JollyRogerFoil006);
  });
});
