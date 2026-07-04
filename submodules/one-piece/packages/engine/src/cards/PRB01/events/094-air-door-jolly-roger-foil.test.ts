import { describe, test } from "vite-plus/test";
import { prb01AirDoorJollyRogerFoil094 } from "../../../../../cards/src/cards/PRB01/events/094-air-door-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-094 Air Door (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01AirDoorJollyRogerFoil094);
  });
});
