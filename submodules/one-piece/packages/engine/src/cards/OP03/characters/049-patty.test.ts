import { describe, test } from "vite-plus/test";
import { op03Patty049 } from "../../../../../cards/src/cards/OP03/characters/049-patty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-049 Patty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Patty049);
  });
});
