import { describe } from "vitest";
import { lesserBoonOfBullets } from "./lesser-boon-of-bullets.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers UI0lAtGQBb-a1 */
describe("Lesser Boon of Bullets — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfBullets);
});
