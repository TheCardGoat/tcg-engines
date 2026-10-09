import { describe } from "vitest";
import { siegeMauler } from "./siege-mauler.ts";

import { proveDefenderDependentPower } from "../../../testing/defender-dependent-power.ts";
/** @covers bsuO8TVe7p-a1 */
describe("siegeMauler defender-dependent power", () => {
  proveDefenderDependentPower(siegeMauler, "domain", 2);
});
