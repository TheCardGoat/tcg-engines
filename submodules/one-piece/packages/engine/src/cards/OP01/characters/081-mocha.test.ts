import { describe, test } from "vite-plus/test";
import { op01Mocha081 } from "../../../../../cards/src/cards/characters/op01-081-mocha.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-081 Mocha", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Mocha081);
  });
});
