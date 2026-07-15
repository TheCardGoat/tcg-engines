import { describe, test } from "vite-plus/test";
import { op01Mocha081 } from "../../../../../cards/src/cards/OP01/characters/081-mocha.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-081 Mocha", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Mocha081);
  });
});
