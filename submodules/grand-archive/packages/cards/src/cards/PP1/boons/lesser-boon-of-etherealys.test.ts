import { describe } from "vitest";
import { lesserBoonOfEtherealys } from "./lesser-boon-of-etherealys.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers NCahvCedfV-a1
 * @covers NCahvCedfV-a2 */
describe("Lesser Boon of Etherealys", () => {
  proveClassBoon(lesserBoonOfEtherealys, "MAGE");
});
