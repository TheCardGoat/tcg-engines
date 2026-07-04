import { describe, test } from "vite-plus/test";
import { prb01DonquixoteFamilyJollyRogerFoil036 } from "../../../../../cards/src/cards/PRB01/events/036-donquixote-family-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-036 Donquixote Family (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01DonquixoteFamilyJollyRogerFoil036);
  });
});
