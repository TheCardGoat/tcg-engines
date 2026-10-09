import { describe } from "vitest";
import { mistralRanger } from "./mistral-ranger.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers lClyP34mj6-a2 */
describe("Mistral Ranger Ranged", () => {
  proveRangedAlly({ card: mistralRanger, power: 2, ranged: 2, classBonus: true });
});
