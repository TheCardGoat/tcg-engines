import { describe } from "vitest";
import { lesserBoonOfElysianBlood } from "./lesser-boon-of-elysian-blood.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers Ss991TWKR9-a1 */
describe("Lesser Boon of Elysian Blood — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfElysianBlood);
});
