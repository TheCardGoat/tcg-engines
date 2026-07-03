import { describe, test } from "vite-plus/test";
import { op10MonkeyDLuffy111 } from "../../../../../cards/src/cards/OP10/characters/111-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-111 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10MonkeyDLuffy111);
  });
});
