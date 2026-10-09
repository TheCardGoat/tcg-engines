import { describe } from "vitest";
import { greaterBoonOfEnki } from "./greater-boon-of-enki.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers fZZqzAXNAc-a1 @covers fZZqzAXNAc-a2 */
describe("Greater Boon of Enki — Level Locked", () => {
  proveLevelLockedBoon({ card: greaterBoonOfEnki, threshold: 2, drawOnGain: 1 });
});
