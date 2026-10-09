import { describe } from "vitest";
import { greaterBoonOfParvati } from "./greater-boon-of-parvati.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers WOTtcgwVc9-a1 @covers WOTtcgwVc9-a2 */
describe("Greater Boon of Parvati — Level Locked", () => {
  proveLevelLockedBoon({ card: greaterBoonOfParvati, threshold: 2, drawOnGain: 1 });
});
