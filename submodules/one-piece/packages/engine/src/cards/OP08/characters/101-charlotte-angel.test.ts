import { describe, test } from "vite-plus/test";
import { op08CharlotteAngel101 } from "../../../../../cards/src/cards/characters/op08-101-charlotte-angel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-101 Charlotte Angel", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteAngel101);
  });
});
