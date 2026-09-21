import { describe, test } from "vite-plus/test";
import { op11Mocha015 } from "../../../../../cards/src/cards/characters/op11-015-mocha.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-015 Mocha", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Mocha015);
  });
});
