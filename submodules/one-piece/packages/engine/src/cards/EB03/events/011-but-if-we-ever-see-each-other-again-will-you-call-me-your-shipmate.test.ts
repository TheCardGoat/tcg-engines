import { describe, test } from "vite-plus/test";
import { eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011 } from "../../../../../cards/src/cards/EB03/events/011-but-if-we-ever-see-each-other-again-will-you-call-me-your-shipmate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-011 But If We Ever See Each Other Again... Will You Call Me Your Shipmate?!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011);
  });
});
