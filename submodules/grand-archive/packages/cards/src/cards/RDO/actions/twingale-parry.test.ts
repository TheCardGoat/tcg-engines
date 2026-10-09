import { describe } from "vitest";
import { twingaleParry } from "./twingale-parry.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers V8XBfRpDRJ-a1 */
describe("twingaleParry prevention", () => {
  proveUnitDamagePrevention({ card: twingaleParry, cost: 2, capacity: 2, combatOnly: true });
});
