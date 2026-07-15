import { describe, test } from "vite-plus/test";
import { op01MonkeyDLuffy024 } from "../../../../../cards/src/cards/OP01/characters/024-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-024 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01MonkeyDLuffy024);
  });
});
