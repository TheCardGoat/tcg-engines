import { describe, test } from "vite-plus/test";
import { eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059 } from "../../../../../cards/src/cards/EB02/events/059-without-your-help-i-can-t-become-the-king-of-the-pirates.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-059 Without Your Help I Can't Become the King of the Pirates!!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059);
  });
});
