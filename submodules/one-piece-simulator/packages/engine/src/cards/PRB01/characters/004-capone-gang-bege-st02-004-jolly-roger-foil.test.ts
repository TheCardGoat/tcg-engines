import { describe, test } from "vite-plus/test";
import { prb01CaponeGangBegeSt02004JollyRogerFoil004 } from "../../../../../cards/src/cards/PRB01/characters/004-capone-gang-bege-st02-004-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST02-004 004-capone-gang-bege-st02-004-jolly-roger-foil", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CaponeGangBegeSt02004JollyRogerFoil004);
  });
});
