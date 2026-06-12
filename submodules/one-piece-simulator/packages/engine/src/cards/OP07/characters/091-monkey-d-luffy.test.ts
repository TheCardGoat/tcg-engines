import { describe, test } from "vite-plus/test";
import { op07MonkeyDLuffy091 } from "../../../../../cards/src/cards/OP07/characters/091-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-091 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MonkeyDLuffy091);
  });
});
