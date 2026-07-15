import { describe, test } from "vite-plus/test";
import { op07Dice007 } from "../../../../../cards/src/cards/OP07/characters/007-dice.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-007 Dice", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Dice007);
  });
});
