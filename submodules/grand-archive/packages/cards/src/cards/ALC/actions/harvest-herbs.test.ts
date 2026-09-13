import { describe } from "vitest";
import { proveGather } from "../../../testing/gather.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { harvestHerbs } from "./harvest-herbs.ts";

/** @covers zadf9q1wl8-a2 */
describe("Harvest Herbs — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: harvestHerbs });
});

/** @covers zadf9q1wl8-a1 */
describe("Harvest Herbs — Gather", () => {
  proveGather({ card: harvestHerbs, reserveCost: 1, classBonus: false });
});
