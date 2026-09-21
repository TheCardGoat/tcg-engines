import { describe, test } from "vite-plus/test";
import { op10Sugar003 } from "../../../../../cards/src/cards/leaders/op10-003-sugar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-003 Sugar", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sugar003);
  });
});
