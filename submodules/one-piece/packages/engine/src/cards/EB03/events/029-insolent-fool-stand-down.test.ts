import { describe, test } from "vite-plus/test";
import { eb03InsolentFoolStandDown029 } from "../../../../../cards/src/cards/events/eb03-029-insolent-fool-stand-down.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-029 Insolent Fool!! Stand Down!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03InsolentFoolStandDown029);
  });
});
