import { describe } from "vitest";
import { lesserBoonOfProvocation } from "./lesser-boon-of-provocation.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers SyDMB8D78p-a1 */
describe("Lesser Boon of Provocation — Level Locked", () => {
  proveLevelLockedBoon({ card: lesserBoonOfProvocation, threshold: 1, opponentRecollection: true });
});
