import { describe, test } from "vite-plus/test";
import { op10Violet062 } from "../../../../../cards/src/cards/OP10/characters/062-violet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-062 Violet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Violet062);
  });
});
