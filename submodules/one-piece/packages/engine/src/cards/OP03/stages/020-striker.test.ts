import { describe, test } from "vite-plus/test";
import { op03Striker020 } from "../../../../../cards/src/cards/stages/op03-020-striker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-020 Striker", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Striker020);
  });
});
