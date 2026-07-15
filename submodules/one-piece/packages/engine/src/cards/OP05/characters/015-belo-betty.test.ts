import { describe, test } from "vite-plus/test";
import { op05BeloBetty015 } from "../../../../../cards/src/cards/OP05/characters/015-belo-betty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-015 Belo Betty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BeloBetty015);
  });
});
