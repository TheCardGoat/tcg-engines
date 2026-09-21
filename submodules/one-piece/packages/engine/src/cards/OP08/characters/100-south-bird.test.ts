import { describe, test } from "vite-plus/test";
import { op08SouthBird100 } from "../../../../../cards/src/cards/characters/op08-100-south-bird.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-100 South Bird", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SouthBird100);
  });
});
