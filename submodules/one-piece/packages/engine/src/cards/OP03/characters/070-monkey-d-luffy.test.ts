import { describe, test } from "vite-plus/test";
import { op03MonkeyDLuffy070 } from "../../../../../cards/src/cards/OP03/characters/070-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-070 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03MonkeyDLuffy070);
  });
});
