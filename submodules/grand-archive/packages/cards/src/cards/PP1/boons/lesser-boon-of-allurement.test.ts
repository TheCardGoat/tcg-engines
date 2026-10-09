import { describe } from "vitest";
import { lesserBoonOfAllurement } from "./lesser-boon-of-allurement.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers JuKoCVIvCG-a1 */
describe("Lesser Boon of Allurement — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfAllurement);
});
