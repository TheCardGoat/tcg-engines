import { describe, test } from "vite-plus/test";
import { op03BuzzCutMochi119 } from "../../../../../cards/src/cards/events/op03-119-buzz-cut-mochi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-119 Buzz Cut Mochi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03BuzzCutMochi119);
  });
});
