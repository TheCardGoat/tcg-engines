import { describe, test } from "vite-plus/test";
import { op05MonkeyDLuffy119 } from "../../../../../cards/src/cards/OP05/characters/119-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-119 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MonkeyDLuffy119);
  });
});
