import { describe, test } from "vite-plus/test";
import { op13SmokerOp10030Sp030 } from "../../../../../cards/src/cards/OP13/characters/030-smoker-op10-030-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-030 Smoker - OP10-030 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SmokerOp10030Sp030);
  });
});
