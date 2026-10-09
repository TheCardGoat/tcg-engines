import { describe } from "vitest";
import { lesserBoonOfDistance } from "./lesser-boon-of-distance.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers l8PytM9CpG-a1 */
describe("Lesser Boon of Distance — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfDistance);
});
