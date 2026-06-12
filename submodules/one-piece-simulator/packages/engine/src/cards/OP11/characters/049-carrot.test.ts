import { describe, test } from "vite-plus/test";
import { op11Carrot049 } from "../../../../../cards/src/cards/OP11/characters/049-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-049 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Carrot049);
  });
});
