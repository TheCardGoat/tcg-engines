import { proveTeamStealth } from "../../../testing/team-stealth-action.ts";
import { describe } from "vitest";
import { conceal } from "./conceal.ts";

/** @covers 8nbmykyXcw-a1 */
describe("conceal temporary stealth", () => {
  proveTeamStealth({ card: conceal, cost: 2, championProtected: false });
});
