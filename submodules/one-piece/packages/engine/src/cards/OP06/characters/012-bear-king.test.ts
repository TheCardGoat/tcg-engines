import { describe, test } from "vite-plus/test";
import { op06BearKing012 } from "../../../../../cards/src/cards/OP06/characters/012-bear-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-012 Bear.King", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BearKing012);
  });
});
