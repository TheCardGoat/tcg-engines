import { describe, test } from "vite-plus/test";
import { op01XDrake054 } from "../../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-054 X.Drake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01XDrake054);
  });
});
