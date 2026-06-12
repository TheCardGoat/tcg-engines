import { describe, test } from "vite-plus/test";
import { op08Chess005 } from "../../../../../cards/src/cards/OP08/characters/005-chess.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-005 Chess", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Chess005);
  });
});
