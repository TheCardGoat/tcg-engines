import { describe, test } from "vite-plus/test";
import { op07Pappag030 } from "../../../../../cards/src/cards/characters/op07-030-pappag.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-030 Pappag", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Pappag030);
  });
});
