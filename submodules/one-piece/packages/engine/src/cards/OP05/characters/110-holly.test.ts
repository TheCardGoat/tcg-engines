import { describe, test } from "vite-plus/test";
import { op05Holly110 } from "../../../../../cards/src/cards/characters/op05-110-holly.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-110 Holly", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Holly110);
  });
});
