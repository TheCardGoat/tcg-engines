import { describe, test } from "vite-plus/test";
import { op09Jozu049 } from "../../../../../cards/src/cards/OP09/characters/049-jozu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-049 Jozu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Jozu049);
  });
});
