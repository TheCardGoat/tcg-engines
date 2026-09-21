import { describe, test } from "vite-plus/test";
import { op08Robson013 } from "../../../../../cards/src/cards/characters/op08-013-robson.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-013 Robson", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Robson013);
  });
});
