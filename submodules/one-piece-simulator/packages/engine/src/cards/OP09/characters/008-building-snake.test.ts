import { describe, test } from "vite-plus/test";
import { op09BuildingSnake008 } from "../../../../../cards/src/cards/OP09/characters/008-building-snake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-008 Building Snake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BuildingSnake008);
  });
});
