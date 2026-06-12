import { describe, test } from "vite-plus/test";
import { prb01ThunderBoltJollyRogerFoil121 } from "../../../../../cards/src/cards/PRB01/events/121-thunder-bolt-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-121 Thunder Bolt (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ThunderBoltJollyRogerFoil121);
  });
});
