import { describe, test } from "vite-plus/test";
import { op06Gasparde005 } from "../../../../../cards/src/cards/OP06/characters/005-gasparde.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-005 Gasparde", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Gasparde005);
  });
});
