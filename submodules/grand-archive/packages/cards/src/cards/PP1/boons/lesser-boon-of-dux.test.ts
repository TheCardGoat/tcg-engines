import { describe } from "vitest";
import { lesserBoonOfDux } from "./lesser-boon-of-dux.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers QLWT8BnvlU-a1 */
describe("Lesser Boon of Dux — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfDux);
});
