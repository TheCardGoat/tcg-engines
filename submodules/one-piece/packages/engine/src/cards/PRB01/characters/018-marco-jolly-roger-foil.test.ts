import { describe, test } from "vite-plus/test";
import { prb01MarcoJollyRogerFoil018 } from "../../../../../cards/src/cards/PRB01/characters/018-marco-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-018 Marco (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01MarcoJollyRogerFoil018);
  });
});
