import { describe, test } from "vite-plus/test";
import { prb01ElThorJollyRogerFoil114 } from "../../../../../cards/src/cards/PRB01/events/114-el-thor-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-114 El Thor (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ElThorJollyRogerFoil114);
  });
});
