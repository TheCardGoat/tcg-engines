import { describe, test } from "vite-plus/test";
import { prb01ShockwaveJollyRogerFoil014 } from "../../../../../cards/src/cards/PRB01/events/014-shockwave-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST06-014 Shockwave (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ShockwaveJollyRogerFoil014);
  });
});
