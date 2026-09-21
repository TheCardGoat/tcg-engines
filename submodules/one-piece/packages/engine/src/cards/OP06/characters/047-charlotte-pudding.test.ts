import { describe, test } from "vite-plus/test";
import { op06CharlottePudding047 } from "../../../../../cards/src/cards/characters/op06-047-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-047 Charlotte Pudding", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06CharlottePudding047);
  });
});
