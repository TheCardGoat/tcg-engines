import { describe, test } from "vite-plus/test";
import { prb01ThreeThousandWorldsJollyRogerFoil057 } from "../../../../../cards/src/cards/PRB01/events/057-three-thousand-worlds-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-057 Three Thousand Worlds (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ThreeThousandWorldsJollyRogerFoil057);
  });
});
