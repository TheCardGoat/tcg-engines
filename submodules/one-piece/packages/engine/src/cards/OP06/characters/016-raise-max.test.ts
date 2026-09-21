import { describe, test } from "vite-plus/test";
import { op06RaiseMax016 } from "../../../../../cards/src/cards/characters/op06-016-raise-max.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-016 Raise Max", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06RaiseMax016);
  });
});
