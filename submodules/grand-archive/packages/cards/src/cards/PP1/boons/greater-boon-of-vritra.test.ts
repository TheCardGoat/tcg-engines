import { describe } from "vitest";
import { greaterBoonOfVritra } from "./greater-boon-of-vritra.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers jMH26KLgcd-a1 */
describe("Greater Boon of Vritra — Level Locked", () => {
  proveLevelLockedBoon({ card: greaterBoonOfVritra, threshold: 1 });
});
