import { describe, test } from "vite-plus/test";
import { prb01NarikaburaArrowJollyRogerFoil014 } from "../../../../../cards/src/cards/PRB01/events/014-narikabura-arrow-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST09-014 Narikabura Arrow (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01NarikaburaArrowJollyRogerFoil014);
  });
});
