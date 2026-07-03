import { describe, test } from "vite-plus/test";
import { op10Sugar003 } from "../../../../../cards/src/cards/OP10/leaders/003-sugar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-003 Sugar", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sugar003);
  });
});
