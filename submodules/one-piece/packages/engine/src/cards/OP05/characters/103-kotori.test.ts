import { describe, test } from "vite-plus/test";
import { op05Kotori103 } from "../../../../../cards/src/cards/OP05/characters/103-kotori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-103 Kotori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Kotori103);
  });
});
