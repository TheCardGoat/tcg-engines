import { describe, test } from "vite-plus/test";
import { op10Smoker001 } from "../../../../../cards/src/cards/leaders/op10-001-smoker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-001 Smoker", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Smoker001);
  });
});
