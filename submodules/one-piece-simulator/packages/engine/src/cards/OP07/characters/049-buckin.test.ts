import { describe, test } from "vite-plus/test";
import { op07Buckin049 } from "../../../../../cards/src/cards/OP07/characters/049-buckin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-049 Buckin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Buckin049);
  });
});
