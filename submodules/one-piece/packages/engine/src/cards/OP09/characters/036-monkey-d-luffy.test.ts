import { describe, test } from "vite-plus/test";
import { op09MonkeyDLuffy036 } from "../../../../../cards/src/cards/OP09/characters/036-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-036 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MonkeyDLuffy036);
  });
});
