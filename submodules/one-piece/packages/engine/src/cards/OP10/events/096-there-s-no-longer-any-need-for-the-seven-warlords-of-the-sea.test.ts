import { describe, test } from "vite-plus/test";
import { op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096 } from "../../../../../cards/src/cards/OP10/events/096-there-s-no-longer-any-need-for-the-seven-warlords-of-the-sea.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-096 There's No Longer Any Need for the Seven Warlords of the Sea!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096);
  });
});
