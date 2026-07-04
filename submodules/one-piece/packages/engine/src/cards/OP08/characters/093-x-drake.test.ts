import { describe, test } from "vite-plus/test";
import { op08XDrake093 } from "../../../../../cards/src/cards/OP08/characters/093-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-093 X.Drake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08XDrake093);
  });
});
