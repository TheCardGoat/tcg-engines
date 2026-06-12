import { describe, test } from "vite-plus/test";
import { prb02YouReTheOneWhoShouldDisappearReprint115 } from "../../../../../cards/src/cards/PRB02/events/115-you-re-the-one-who-should-disappear-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-115 You're the One Who Should Disappear (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02YouReTheOneWhoShouldDisappearReprint115);
  });
});
