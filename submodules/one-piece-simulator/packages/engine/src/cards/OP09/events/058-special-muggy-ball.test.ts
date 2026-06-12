import { describe, test } from "vite-plus/test";
import { op09SpecialMuggyBall058 } from "../../../../../cards/src/cards/OP09/events/058-special-muggy-ball.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-058 Special Muggy Ball", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09SpecialMuggyBall058);
  });
});
