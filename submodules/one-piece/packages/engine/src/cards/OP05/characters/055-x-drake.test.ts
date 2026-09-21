import { describe, test } from "vite-plus/test";
import { op05XDrake055 } from "../../../../../cards/src/cards/characters/op05-055-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-055 X.Drake", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05XDrake055);
  });
});
