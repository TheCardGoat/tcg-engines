import { describe } from "vitest";
import { lesserBoonOfNuwa } from "./lesser-boon-of-nuwa.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers CW73nq8jCR-a1 */
describe("Lesser Boon of Nuwa — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfNuwa);
});
