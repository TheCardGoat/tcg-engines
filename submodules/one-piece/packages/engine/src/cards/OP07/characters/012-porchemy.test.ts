import { describe, test } from "vite-plus/test";
import { op07Porchemy012 } from "../../../../../cards/src/cards/characters/op07-012-porchemy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-012 Porchemy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Porchemy012);
  });
});
