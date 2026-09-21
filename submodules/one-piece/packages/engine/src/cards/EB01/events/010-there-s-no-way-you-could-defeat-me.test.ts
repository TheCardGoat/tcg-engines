import { describe, test } from "vite-plus/test";
import { eb01ThereSNoWayYouCouldDefeatMe010 } from "../../../../../cards/src/cards/events/eb01-010-there-s-no-way-you-could-defeat-me.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-010 There's No Way You Could Defeat Me!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01ThereSNoWayYouCouldDefeatMe010);
  });
});
