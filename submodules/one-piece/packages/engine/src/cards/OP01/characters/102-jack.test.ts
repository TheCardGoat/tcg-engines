import { describe, test } from "vite-plus/test";
import { op01Jack102 } from "../../../../../cards/src/cards/characters/op01-102-jack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-102 Jack", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Jack102);
  });
});
