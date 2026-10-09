import { describe } from "vitest";
import { lesserBoonOfZerusa } from "./lesser-boon-of-zerusa.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers UC9byG4aD5-a1 */
describe("Lesser Boon of Zerusa — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfZerusa);
});
