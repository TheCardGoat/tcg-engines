import { describe } from "vitest";
import { searingRebuke } from "./searing-rebuke.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers hdvpug4d5m-a1 */
describe("searingRebuke prevention", () => {
  proveUnitDamagePrevention({ card: searingRebuke, cost: 2, capacity: 3, ownChampion: true });
});
