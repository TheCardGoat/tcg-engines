import { describe, test } from "vite-plus/test";
import { eb03SSnake059 } from "../../../../../cards/src/cards/EB03/characters/059-s-snake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-059 S-Snake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03SSnake059);
  });
});
