import { describe } from "vitest";
import { greaterBoonOfInari } from "./greater-boon-of-inari.ts";
import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers ozltjoTDQe-a1 */
describe("greater-boon-of-inari class and base-level locks", () => {
  proveLevelLockedBoon({
    card: greaterBoonOfInari,
    threshold: 2,
    classLocked: true,
    chooseNone: true,
  });
});
