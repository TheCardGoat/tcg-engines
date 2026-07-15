import { describe, test } from "vite-plus/test";
import { op07MonkeyDDragon015 } from "../../../../../cards/src/cards/OP07/characters/015-monkey-d-dragon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-015 Monkey.D.Dragon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MonkeyDDragon015);
  });
});
