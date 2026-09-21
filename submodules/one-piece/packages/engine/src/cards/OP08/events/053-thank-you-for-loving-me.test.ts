import { describe, test } from "vite-plus/test";
import { op08ThankYouForLovingMe053 } from "../../../../../cards/src/cards/events/op08-053-thank-you-for-loving-me.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-053 Thank You...for Loving Me!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ThankYouForLovingMe053);
  });
});
