import { describe, test } from "vite-plus/test";
import { op06MonkeyDLuffy013 } from "../../../../../cards/src/cards/OP06/characters/013-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-013 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06MonkeyDLuffy013);
  });
});
