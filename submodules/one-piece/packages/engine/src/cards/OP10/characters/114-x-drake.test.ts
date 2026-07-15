import { describe, test } from "vite-plus/test";
import { op10XDrake114 } from "../../../../../cards/src/cards/OP10/characters/114-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-114 X.Drake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10XDrake114);
  });
});
