import { describe, test } from "vite-plus/test";
import { op11CharlottePudding070 } from "../../../../../cards/src/cards/OP11/characters/070-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-070 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlottePudding070);
  });
});
