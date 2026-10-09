import { describe } from "vitest";
import { lesserBoonOfRevelry } from "./lesser-boon-of-revelry.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers AOFRjoIHVe-a1 */
describe("Lesser Boon of Revelry — Level Locked", () => {
  proveLevelLockedBoon({ card: lesserBoonOfRevelry, threshold: 1 });
});
