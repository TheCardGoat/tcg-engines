import { describe, test } from "vite-plus/test";
import { op13SSnake114 } from "../../../../../cards/src/cards/OP13/characters/114-s-snake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-114 S-Snake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SSnake114);
  });
});
