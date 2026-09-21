import { describe, test } from "vite-plus/test";
import { op01Smiley072 } from "../../../../../cards/src/cards/characters/op01-072-smiley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-072 Smiley", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Smiley072);
  });
});
