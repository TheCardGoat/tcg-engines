import { describe, test } from "vite-plus/test";
import { op13IfIBowedDownToPowerWhatSThePointInLiving057 } from "../../../../../cards/src/cards/OP13/events/057-if-i-bowed-down-to-power-what-s-the-point-in-living.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-057 If I Bowed Down to Power, What's the Point in Living?", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13IfIBowedDownToPowerWhatSThePointInLiving057);
  });
});
