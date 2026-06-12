import { describe, test } from "vite-plus/test";
import { prb01UpperYardJollyRogerFoil117 } from "../../../../../cards/src/cards/PRB01/stages/117-upper-yard-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-117 Upper Yard (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01UpperYardJollyRogerFoil117);
  });
});
