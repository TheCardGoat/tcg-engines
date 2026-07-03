import { describe, test } from "vite-plus/test";
import { op14eb04XDrake016 } from "../../../../../cards/src/cards/OP14EB04/characters/016-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-016 X.Drake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04XDrake016);
  });
});
