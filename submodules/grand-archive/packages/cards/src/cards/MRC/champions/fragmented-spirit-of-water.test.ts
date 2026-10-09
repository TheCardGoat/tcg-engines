import { describe } from "vitest";
import { fragmentedSpiritOfWater } from "./fragmented-spirit-of-water.ts";
import { spiritShard } from "../tokens/spirit-shard.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers kat9hreqhj-a1 */
describe("fragmentedSpiritOfWater starting sequence", () =>
  proveStartingGlimpse({ card: fragmentedSpiritOfWater, count: 6, draw: 6, summon: spiritShard }));
