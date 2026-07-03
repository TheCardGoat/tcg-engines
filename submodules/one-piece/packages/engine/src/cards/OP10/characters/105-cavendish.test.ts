import { describe, test } from "vite-plus/test";
import { op10Cavendish105 } from "../../../../../cards/src/cards/OP10/characters/105-cavendish.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-105 Cavendish", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Cavendish105);
  });
});
