import { describe } from "vitest";
import { lesserBoonOfPulousa } from "./lesser-boon-of-pulousa.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers V6yubXhzYB-a1
 * @covers V6yubXhzYB-a2 */
describe("Lesser Boon of Pulousa", () => {
  proveClassBoon(lesserBoonOfPulousa, "ASSASSIN");
});
