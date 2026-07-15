import { describe, test } from "vite-plus/test";
import { op07MonkeyDDragon001 } from "../../../../../cards/src/cards/OP07/leaders/001-monkey-d-dragon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-001 Monkey.D.Dragon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MonkeyDDragon001);
  });
});
