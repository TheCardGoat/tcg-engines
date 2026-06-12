import { describe, test } from "vite-plus/test";
import { op08SSnake112 } from "../../../../../cards/src/cards/OP08/characters/112-s-snake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-112 S-Snake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SSnake112);
  });
});
