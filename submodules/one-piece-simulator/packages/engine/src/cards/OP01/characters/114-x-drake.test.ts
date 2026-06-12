import { describe, test } from "vite-plus/test";
import { op01XDrake114 } from "../../../../../cards/src/cards/OP01/characters/114-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-114 X.Drake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01XDrake114);
  });
});
