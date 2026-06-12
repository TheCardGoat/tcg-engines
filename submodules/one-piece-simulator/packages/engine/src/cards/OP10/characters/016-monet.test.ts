import { describe, test } from "vite-plus/test";
import { op10Monet016 } from "../../../../../cards/src/cards/OP10/characters/016-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-016 Monet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Monet016);
  });
});
