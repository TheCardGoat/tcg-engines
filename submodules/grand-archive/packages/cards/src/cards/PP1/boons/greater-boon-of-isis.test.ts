import { describe } from "vitest";
import { greaterBoonOfIsis } from "./greater-boon-of-isis.ts";
import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers ZUXCYJVafM-a1 */
describe("greater-boon-of-isis class and base-level locks", () => {
  proveLevelLockedBoon({
    card: greaterBoonOfIsis,
    threshold: 2,
    classLocked: true,
    chooseNone: true,
  });
});
