import { describe, test } from "vite-plus/test";
import { op07Pythagoras105 } from "../../../../../cards/src/cards/OP07/characters/105-pythagoras.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-105 Pythagoras", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Pythagoras105);
  });
});
