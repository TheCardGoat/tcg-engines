import { describe, test } from "vite-plus/test";
import { op07MonkeyDLuffy033 } from "../../../../../cards/src/cards/OP07/characters/033-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-033 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MonkeyDLuffy033);
  });
});
