import { describe } from "vitest";
import { resoluteStand } from "./resolute-stand.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers o6gb0op3nq-a2 */
describe("resoluteStand prevention", () => {
  proveUnitDamagePrevention({
    card: resoluteStand,
    cost: 3,
    capacity: 3,
    combatOnly: true,
    everyInstance: true,
  });
});
