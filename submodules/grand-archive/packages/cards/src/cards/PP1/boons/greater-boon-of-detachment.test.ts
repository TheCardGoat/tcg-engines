import { describe } from "vitest";
import { greaterBoonOfDetachment } from "./greater-boon-of-detachment.ts";
import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers MzGWQK0E2o-a1 */
describe("greater-boon-of-detachment class and base-level locks", () => {
  proveLevelLockedBoon({
    card: greaterBoonOfDetachment,
    threshold: 2,
    classLocked: true,
    chooseNone: true,
  });
});
