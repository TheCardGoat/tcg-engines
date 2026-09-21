import { describe, test } from "vite-plus/test";
import { op01Bellamy076 } from "../../../../../cards/src/cards/characters/op01-076-bellamy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-076 Bellamy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Bellamy076);
  });
});
