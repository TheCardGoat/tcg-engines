import { describe, test } from "vite-plus/test";
import { op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075 } from "../../../../../cards/src/cards/OP13/events/075-guess-we-ll-have-another-scrap-you-can-only-risk-death-while-you-re-still-alive.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-075 Guess We'll Have Another Scrap. You Can Only Risk Death While You're Still Alive!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075);
  });
});
