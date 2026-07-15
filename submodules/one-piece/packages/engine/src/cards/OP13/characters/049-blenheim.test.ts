import { describe, test } from "vite-plus/test";
import { op13Blenheim049 } from "../../../../../cards/src/cards/OP13/characters/049-blenheim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-049 Blenheim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Blenheim049);
  });
});
