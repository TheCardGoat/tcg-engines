import { describe, test } from "vite-plus/test";
import { op09SpecialMuggyBall058 } from "../../../../../cards/src/cards/events/op09-058-special-muggy-ball.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-058 Special Muggy Ball", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09SpecialMuggyBall058);
  });
});
