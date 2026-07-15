import { describe, test } from "vite-plus/test";
import { op10Cavendish045 } from "../../../../../cards/src/cards/OP10/characters/045-cavendish.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-045 Cavendish", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Cavendish045);
  });
});
