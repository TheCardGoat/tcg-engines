import { describe, test } from "vite-plus/test";
import { op12Buggy049 } from "../../../../../cards/src/cards/OP12/characters/049-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-049 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Buggy049);
  });
});
