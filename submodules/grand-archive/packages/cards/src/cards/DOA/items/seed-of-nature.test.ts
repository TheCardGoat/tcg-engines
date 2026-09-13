import { proveItemLevelAbility } from "../../../testing/item-level-ability.ts";
import { proveRestedEntry } from "../../../testing/rested-entry.ts";
import { describe } from "vitest";
import { seedOfNature } from "./seed-of-nature.ts";

/** @covers ybdj1Db9jz-a1 */
describe("Seed of Nature \u2014 resolution", () => {
  proveRestedEntry({ card: seedOfNature, cost: { kind: "memory", amount: 0 } });
});

/** @covers ybdj1Db9jz-a2 @covers ybdj1Db9jz-a3 */
describe("Seed of Nature \u2014 resolution", () => {
  proveItemLevelAbility({
    card: seedOfNature,
    abilityId: "ybdj1Db9jz-a3",
    amount: 2,
    banish: true,
    restricted: true,
    classBonus: true,
    entersRested: true,
  });
});

describe("nonmatching champion", () => {
  proveItemLevelAbility({
    card: seedOfNature,
    abilityId: "ybdj1Db9jz-a3",
    amount: 2,
    banish: true,
    restricted: true,
    classBonus: false,
    entersRested: true,
  });
});
