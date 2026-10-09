import { describe } from "vitest";
import { greaterBoonOfShou } from "./greater-boon-of-shou.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers Zw0T2GmowK-a1 @covers Zw0T2GmowK-a2 */
describe("Greater Boon of Shou — Level Locked", () => {
  proveLevelLockedBoon({ card: greaterBoonOfShou, threshold: 2, drawOnGain: 1 });
});
