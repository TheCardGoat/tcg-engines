import { describe } from "vitest";
import { quickdrawPiercer } from "./quickdraw-piercer.ts";
import { proveGunMustBeLoaded } from "../../../testing/gun-loaded.ts";
/** @covers j4f15joh30-a1 */
describe("Quickdraw Piercer — Gun", () => {
  proveGunMustBeLoaded(quickdrawPiercer);
});
