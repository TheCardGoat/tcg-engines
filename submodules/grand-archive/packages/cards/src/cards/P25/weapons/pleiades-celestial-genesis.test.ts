import { describe } from "vitest";
import { pleiadesCelestialGenesis } from "./pleiades-celestial-genesis.ts";

import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
/** @covers rsps1qnzfl-a1 */
describe("pleiadesCelestialGenesis class Glimpse", () => {
  for (const classBonus of [false, true])
    proveGlimpsePlay({
      card: pleiadesCelestialGenesis,
      cost: { kind: "memory", amount: 0 },
      count: 3,
      classRestricted: true,
      classBonus,
      preparation: 0,
    });
});
