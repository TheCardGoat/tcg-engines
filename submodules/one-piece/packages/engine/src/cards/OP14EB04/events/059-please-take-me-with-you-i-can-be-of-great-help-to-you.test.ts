import { describe, test } from "vite-plus/test";
import { op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059 } from "../../../../../cards/src/cards/events/op14-059-please-take-me-with-you-i-can-be-of-great-help-to-you.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-059 Please Take Me with You!! I Can Be of Great Help to You!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059);
  });
});
