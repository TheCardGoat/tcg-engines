import { describe } from "vitest";
import { waterloggedRanger } from "./waterlogged-ranger.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 3w5wskifp2-a1 */
describe("Waterlogged Ranger Ranged", () => {
  proveRangedAlly({ card: waterloggedRanger, power: 2, ranged: 2, classBonus: false });
});
