import { describe, test } from "vite-plus/test";
import { eb03ThanksForTheTreat038 } from "../../../../../cards/src/cards/events/eb03-038-thanks-for-the-treat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-038 Thanks for the Treat.", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03ThanksForTheTreat038);
  });
});
