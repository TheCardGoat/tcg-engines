import { describe, test } from "vite-plus/test";
import { op06CharlottePudding047 } from "../../../../../cards/src/cards/OP06/characters/047-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-047 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06CharlottePudding047);
  });
});
