import { describe, test } from "vite-plus/test";
import { op08CharlotteCustard103 } from "../../../../../cards/src/cards/characters/op08-103-charlotte-custard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-103 Charlotte Custard", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteCustard103);
  });
});
