import { describe, test } from "vite-plus/test";
import { op10Sabo049 } from "../../../../../cards/src/cards/OP10/characters/049-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-049 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sabo049);
  });
});
