import { describe, test } from "vite-plus/test";
import { op12CharlottePudding071 } from "../../../../../cards/src/cards/OP12/characters/071-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-071 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12CharlottePudding071);
  });
});
