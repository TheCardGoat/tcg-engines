import { describe } from "vitest";
import { standBeforeTheQueen } from "./stand-before-the-queen.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers v9SJgS6z40-a1 */
describe("Stand Before the Queen prevention", () => {
  proveUnitDamagePrevention({ card: standBeforeTheQueen, cost: 2, capacity: 2 });
});
