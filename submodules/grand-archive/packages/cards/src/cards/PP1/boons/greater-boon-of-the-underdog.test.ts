import { describe } from "vitest";
import { greaterBoonOfTheUnderdog } from "./greater-boon-of-the-underdog.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers nETOkMHYwv-a1 @covers nETOkMHYwv-a3 */
describe("Greater Boon of the Underdog — Level Locked", () => {
  proveLevelLockedBoon({
    card: greaterBoonOfTheUnderdog,
    threshold: 2,
    allyTarget: true,
    drawOnGain: 2,
    buffOnGain: 2,
  });
});
