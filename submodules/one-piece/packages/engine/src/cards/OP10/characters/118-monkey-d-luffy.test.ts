import { describe, test } from "vite-plus/test";
import { op10MonkeyDLuffy118 } from "../../../../../cards/src/cards/OP10/characters/118-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-118 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10MonkeyDLuffy118);
  });
});
