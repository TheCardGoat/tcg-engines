import { describe, test } from "vite-plus/test";
import { op06WhiteSnake059 } from "../../../../../cards/src/cards/OP06/events/059-white-snake.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-059 White Snake", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06WhiteSnake059);
  });
});
