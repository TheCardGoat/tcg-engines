import { describe, test } from "vite-plus/test";
import { op07Moda014 } from "../../../../../cards/src/cards/characters/op07-014-moda.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-014 Moda", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Moda014);
  });
});
