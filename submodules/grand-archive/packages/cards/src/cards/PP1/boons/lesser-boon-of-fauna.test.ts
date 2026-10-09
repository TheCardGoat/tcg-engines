import { describe } from "vitest";
import { lesserBoonOfFauna } from "./lesser-boon-of-fauna.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers rAWlj4c4Ws-a1 */
describe("Lesser Boon of Fauna — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfFauna);
});
