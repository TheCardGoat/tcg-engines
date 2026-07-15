import { describe, test } from "vite-plus/test";
import { prb01GuardPointJollyRogerFoil014 } from "../../../../../cards/src/cards/PRB01/events/014-guard-point-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST01-014 Guard Point (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01GuardPointJollyRogerFoil014);
  });
});
