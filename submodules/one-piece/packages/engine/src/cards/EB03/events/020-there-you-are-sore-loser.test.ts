import { describe, test } from "vite-plus/test";
import { eb03ThereYouAreSoreLoser020 } from "../../../../../cards/src/cards/events/eb03-020-there-you-are-sore-loser.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-020 There You Are, Sore Loser!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03ThereYouAreSoreLoser020);
  });
});
