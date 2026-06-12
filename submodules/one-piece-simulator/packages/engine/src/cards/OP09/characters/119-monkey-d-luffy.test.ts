import { describe, test } from "vite-plus/test";
import { op09MonkeyDLuffy119 } from "../../../../../cards/src/cards/OP09/characters/119-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-119 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MonkeyDLuffy119);
  });
});
