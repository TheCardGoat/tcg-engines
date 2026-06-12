import { describe, test } from "vite-plus/test";
import { op11XDrake017 } from "../../../../../cards/src/cards/OP11/characters/017-x-drake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-017 X.Drake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11XDrake017);
  });
});
