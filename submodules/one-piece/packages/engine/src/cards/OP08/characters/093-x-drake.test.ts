import { describe, test } from "vite-plus/test";
import { op08XDrake093 } from "../../../../../cards/src/cards/characters/op08-093-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-093 X.Drake", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08XDrake093);
  });
});
