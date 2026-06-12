import { describe, test } from "vite-plus/test";
import { op07BasilHawkins029 } from "../../../../../cards/src/cards/OP07/characters/029-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-029 Basil Hawkins", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BasilHawkins029);
  });
});
