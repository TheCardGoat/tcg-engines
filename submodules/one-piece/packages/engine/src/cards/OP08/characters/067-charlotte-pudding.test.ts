import { describe, test } from "vite-plus/test";
import { op08CharlottePudding067 } from "../../../../../cards/src/cards/characters/op08-067-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-067 Charlotte Pudding", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlottePudding067);
  });
});
