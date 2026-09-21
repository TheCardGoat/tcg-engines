import { describe, test } from "vite-plus/test";
import { op13Blenheim049 } from "../../../../../cards/src/cards/characters/op13-049-blenheim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-049 Blenheim", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Blenheim049);
  });
});
