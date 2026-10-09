import { describe } from "vitest";
import { lesserBoonOfOzymandias } from "./lesser-boon-of-ozymandias.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers yrmT2lTt9U-a1
 * @covers yrmT2lTt9U-a2 */
describe("Lesser Boon of Ozymandias", () => {
  proveClassBoon(lesserBoonOfOzymandias, "GUARDIAN");
});
