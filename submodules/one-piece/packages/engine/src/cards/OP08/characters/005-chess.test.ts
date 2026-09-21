import { describe, test } from "vite-plus/test";
import { op08Chess005 } from "../../../../../cards/src/cards/characters/op08-005-chess.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-005 Chess", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Chess005);
  });
});
