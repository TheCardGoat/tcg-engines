import { describe, test } from "vite-plus/test";
import { op07Buckin049 } from "../../../../../cards/src/cards/characters/op07-049-buckin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-049 Buckin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Buckin049);
  });
});
