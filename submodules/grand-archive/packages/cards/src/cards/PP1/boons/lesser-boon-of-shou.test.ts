import { describe } from "vitest";
import { lesserBoonOfShou } from "./lesser-boon-of-shou.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers rSIXf50oBc-a1 */
describe("Lesser Boon of Shou — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfShou);
});
