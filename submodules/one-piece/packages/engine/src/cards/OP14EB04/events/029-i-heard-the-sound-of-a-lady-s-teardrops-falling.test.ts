import { describe, test } from "vite-plus/test";
import { op14eb04IHeardTheSoundOfALadySTeardropsFalling029 } from "../../../../../cards/src/cards/events/eb04-029-i-heard-the-sound-of-a-lady-s-teardrops-falling.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-029 I Heard the Sound...of a Lady's Teardrops Falling", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04IHeardTheSoundOfALadySTeardropsFalling029);
  });
});
