import { describe, test } from "vite-plus/test";
import { prb01BoaHancockSt03013JollyRogerFoil013 } from "../../../../../cards/src/cards/PRB01/characters/013-boa-hancock-st03-013-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST03-013 Boa Hancock (ST03-013) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BoaHancockSt03013JollyRogerFoil013);
  });
});
