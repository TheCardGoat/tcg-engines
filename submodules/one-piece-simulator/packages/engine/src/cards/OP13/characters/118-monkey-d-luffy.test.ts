import { describe, test } from "vite-plus/test";
import { op13MonkeyDLuffy118 } from "../../../../../cards/src/cards/OP13/characters/118-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-118 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MonkeyDLuffy118);
  });
});
