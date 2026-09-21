import { describe, test } from "vite-plus/test";
import { op01YouCanBeMySamurai055 } from "../../../../../cards/src/cards/events/op01-055-you-can-be-my-samurai.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-055 You Can Be My Samurai!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01YouCanBeMySamurai055);
  });
});
