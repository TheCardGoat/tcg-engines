import { describe } from "vitest";
import { lesserBoonOfVeilara } from "./lesser-boon-of-veilara.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers GHS9GraLDo-a1
 * @covers GHS9GraLDo-a2 */
describe("Lesser Boon of Veilara", () => {
  proveClassBoon(lesserBoonOfVeilara, "CLERIC");
});
