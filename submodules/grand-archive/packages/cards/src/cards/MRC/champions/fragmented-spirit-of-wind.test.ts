import { describe } from "vitest";
import { fragmentedSpiritOfWind } from "./fragmented-spirit-of-wind.ts";
import { spiritShard } from "../tokens/spirit-shard.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers 1trn0yetae-a1 */
describe("fragmentedSpiritOfWind starting sequence", () =>
  proveStartingGlimpse({ card: fragmentedSpiritOfWind, count: 6, draw: 6, summon: spiritShard }));
