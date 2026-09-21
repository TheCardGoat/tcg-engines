import { describe, test } from "vite-plus/test";
import { op03OutOfTheBag036 } from "../../../../../cards/src/cards/events/op03-036-out-of-the-bag.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-036 Out-of-the-Bag", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03OutOfTheBag036);
  });
});
