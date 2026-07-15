import { describe, test } from "vite-plus/test";
import { op10Mocha015 } from "../../../../../cards/src/cards/OP10/characters/015-mocha.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-015 Mocha", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Mocha015);
  });
});
