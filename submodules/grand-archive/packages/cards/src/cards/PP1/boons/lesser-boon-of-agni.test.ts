import { describe } from "vitest";
import { lesserBoonOfAgni } from "./lesser-boon-of-agni.ts";
import { proveElementBoon } from "../../../testing/element-boon.ts";
/** @covers nbKHFHcvzd-a1 */
describe("lesserBoonOfAgni enabled element", () => {
  proveElementBoon(lesserBoonOfAgni, "FIRE");
});
