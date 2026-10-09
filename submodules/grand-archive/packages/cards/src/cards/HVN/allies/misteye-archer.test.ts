import { describe } from "vitest";
import { misteyeArcher } from "./misteye-archer.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers m6c8xy4cje-a1 */
describe("Misteye Archer Ranged", () => {
  proveRangedAlly({ card: misteyeArcher, power: 1, ranged: 2, classBonus: true });
});
