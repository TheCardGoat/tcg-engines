import { describe } from "vitest";
import { lancelotGoliathOfAesa } from "./lancelot-goliath-of-aesa.ts";
import { proveClassLevelAllyStats } from "../../../testing/class-level-ally-stats.ts";
/** @covers w9n0wpbhig-a2 */
describe("lancelotGoliathOfAesa — Class Bonus level stats", () => {
  proveClassLevelAllyStats(lancelotGoliathOfAesa, 0, 2);
});
