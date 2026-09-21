import { describe, test } from "vite-plus/test";
import { op06Gasparde005 } from "../../../../../cards/src/cards/characters/op06-005-gasparde.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-005 Gasparde", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Gasparde005);
  });
});
