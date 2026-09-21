import { describe, test } from "vite-plus/test";
import { op07Kalifa081 } from "../../../../../cards/src/cards/characters/op07-081-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-081 Kalifa", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Kalifa081);
  });
});
