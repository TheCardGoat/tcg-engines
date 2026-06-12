import { describe, test } from "vite-plus/test";
import { op10Smoker001 } from "../../../../../cards/src/cards/OP10/leaders/001-smoker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-001 Smoker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Smoker001);
  });
});
