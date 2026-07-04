import { describe, test } from "vite-plus/test";
import { op09MonkeyDDragonSp015 } from "../../../../../cards/src/cards/OP09/characters/015-monkey-d-dragon-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-015 Monkey.D.Dragon (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MonkeyDDragonSp015);
  });
});
