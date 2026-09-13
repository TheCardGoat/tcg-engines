import { describe } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { enragedBoars } from "./enraged-boars.ts";

/** @covers MmbQQdsRhi-a1 */
describe("Enraged Boars \u2014 MmbQQdsRhi-a1", () => {
  provePrideAlly({ card: enragedBoars, pride: 5, power: 4 });
});
