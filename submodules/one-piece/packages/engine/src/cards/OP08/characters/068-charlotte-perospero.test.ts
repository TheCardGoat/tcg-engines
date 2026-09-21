import { describe, test } from "vite-plus/test";
import { op08CharlottePerospero068 } from "../../../../../cards/src/cards/characters/op08-068-charlotte-perospero.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-068 Charlotte Perospero", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlottePerospero068);
  });
});
