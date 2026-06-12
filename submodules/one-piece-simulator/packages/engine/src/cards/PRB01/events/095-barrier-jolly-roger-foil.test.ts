import { describe, test } from "vite-plus/test";
import { prb01BarrierJollyRogerFoil095 } from "../../../../../cards/src/cards/PRB01/events/095-barrier-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-095 Barrier!! (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BarrierJollyRogerFoil095);
  });
});
