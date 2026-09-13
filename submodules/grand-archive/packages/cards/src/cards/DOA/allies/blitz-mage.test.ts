import { proveVanillaAlly } from "../../../testing/vanilla-ally.ts";
import { describe } from "vitest";
import { blitzMage } from "./blitz-mage.ts";

/** @covers-card u8m6LuUSSu */
describe("Blitz Mage \u2014 resolution", () => {
  proveVanillaAlly({ card: blitzMage, cost: 3, power: 3, life: 1 });
});
