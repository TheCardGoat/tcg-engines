import { describe, test } from "vite-plus/test";
import { op01Sanji013 } from "../../../../../cards/src/cards/characters/op01-013-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-013 Sanji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Sanji013);
  });
});
