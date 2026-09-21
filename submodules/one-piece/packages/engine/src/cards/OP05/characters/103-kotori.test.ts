import { describe, test } from "vite-plus/test";
import { op05Kotori103 } from "../../../../../cards/src/cards/characters/op05-103-kotori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-103 Kotori", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Kotori103);
  });
});
