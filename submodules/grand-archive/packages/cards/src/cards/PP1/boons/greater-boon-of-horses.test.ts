import { describe } from "vitest";
import { greaterBoonOfHorses } from "./greater-boon-of-horses.ts";
import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers asZfaFnTXs-a1 */
describe("greater-boon-of-horses class and base-level locks", () => {
  proveLevelLockedBoon({
    card: greaterBoonOfHorses,
    threshold: 2,
    classLocked: true,
    chooseNone: true,
  });
});
