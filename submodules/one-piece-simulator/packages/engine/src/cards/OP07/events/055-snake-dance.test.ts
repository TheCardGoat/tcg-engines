import { describe, test } from "vite-plus/test";
import { op07SnakeDance055 } from "../../../../../cards/src/cards/OP07/events/055-snake-dance.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-055 Snake Dance", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07SnakeDance055);
  });
});
