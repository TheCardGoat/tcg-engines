import { describe, test } from "vite-plus/test";
import { op05Gedatsu102 } from "../../../../../cards/src/cards/characters/op05-102-gedatsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-102 Gedatsu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Gedatsu102);
  });
});
