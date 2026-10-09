import { describe } from "vitest";
import { lesserBoonOfOdysseus } from "./lesser-boon-of-odysseus.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers PXWFkT2DQe-a1
 * @covers PXWFkT2DQe-a2 */
describe("Lesser Boon of Odysseus", () => {
  proveClassBoon(lesserBoonOfOdysseus, "WARRIOR");
});
