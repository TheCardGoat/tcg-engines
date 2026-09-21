import { describe, test } from "vite-plus/test";
import { op03Kalifa081 } from "../../../../../cards/src/cards/characters/op03-081-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-081 Kalifa", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kalifa081);
  });
});
