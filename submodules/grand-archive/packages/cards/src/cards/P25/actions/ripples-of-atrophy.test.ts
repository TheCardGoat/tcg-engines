import { describe } from "vitest";
import { ripplesOfAtrophy } from "./ripples-of-atrophy.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers u0yaub9dal-a1 */
describe("ripplesOfAtrophy — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: ripplesOfAtrophy, printedCost: 6 });
});
