import { describe, test } from "vite-plus/test";
import { op05MonkeyDLuffy012 } from "../../../../../cards/src/cards/OP05/characters/012-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST01-012 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MonkeyDLuffy012);
  });
});
