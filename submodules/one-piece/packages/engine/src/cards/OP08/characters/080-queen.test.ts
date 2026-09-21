import { describe, test } from "vite-plus/test";
import { op08Queen080 } from "../../../../../cards/src/cards/characters/op08-080-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-080 Queen", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Queen080);
  });
});
