import { describe, test } from "vite-plus/test";
import { op05Morley016 } from "../../../../../cards/src/cards/OP05/characters/016-morley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-016 Morley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Morley016);
  });
});
