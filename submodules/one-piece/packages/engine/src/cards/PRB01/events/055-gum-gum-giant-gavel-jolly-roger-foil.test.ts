import { describe, test } from "vite-plus/test";
import { prb01GumGumGiantGavelJollyRogerFoil055 } from "../../../../../cards/src/cards/PRB01/events/055-gum-gum-giant-gavel-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-055 Gum-Gum Giant Gavel (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01GumGumGiantGavelJollyRogerFoil055);
  });
});
