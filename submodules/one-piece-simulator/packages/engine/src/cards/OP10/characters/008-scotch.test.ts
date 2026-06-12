import { describe, test } from "vite-plus/test";
import { op10Scotch008 } from "../../../../../cards/src/cards/OP10/characters/008-scotch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-008 Scotch", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Scotch008);
  });
});
