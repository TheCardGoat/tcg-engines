import { describe, test } from "vite-plus/test";
import { prb01OneLeggedToySoldierJollyRogerFoil081 } from "../../../../../cards/src/cards/PRB01/characters/081-one-legged-toy-soldier-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-081 One-Legged Toy Soldier (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01OneLeggedToySoldierJollyRogerFoil081);
  });
});
