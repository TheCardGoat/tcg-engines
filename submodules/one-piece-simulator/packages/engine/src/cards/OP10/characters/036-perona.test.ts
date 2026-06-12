import { describe, test } from "vite-plus/test";
import { op10Perona036 } from "../../../../../cards/src/cards/OP10/characters/036-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-036 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Perona036);
  });
});
