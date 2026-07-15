import { describe, test } from "vite-plus/test";
import { op06RaiseMax016 } from "../../../../../cards/src/cards/OP06/characters/016-raise-max.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-016 Raise Max", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06RaiseMax016);
  });
});
