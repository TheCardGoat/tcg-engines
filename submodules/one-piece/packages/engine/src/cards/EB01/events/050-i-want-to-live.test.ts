import { describe, test } from "vite-plus/test";
import { eb01IWantToLive050 } from "../../../../../cards/src/cards/events/eb01-050-i-want-to-live.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-050 ...I Want to Live!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01IWantToLive050);
  });
});
