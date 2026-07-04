import { describe, test } from "vite-plus/test";
import { op01Bepo049 } from "../../../../../cards/src/cards/OP01/characters/049-bepo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-049 Bepo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Bepo049);
  });
});
