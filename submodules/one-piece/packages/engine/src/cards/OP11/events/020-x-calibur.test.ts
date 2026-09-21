import { describe, test } from "vite-plus/test";
import { op11XCalibur020 } from "../../../../../cards/src/cards/events/op11-020-x-calibur.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-020 X Calibur", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11XCalibur020);
  });
});
