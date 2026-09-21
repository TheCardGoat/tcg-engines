import { describe, test } from "vite-plus/test";
import { op07Edison100 } from "../../../../../cards/src/cards/characters/op07-100-edison.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-100 Edison", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Edison100);
  });
});
