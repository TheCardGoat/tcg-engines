import { describe } from "vitest";
import { fragmentedSpiritOfFire } from "./fragmented-spirit-of-fire.ts";
import { spiritShard } from "../tokens/spirit-shard.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers yvn1uoy5tt-a1 */
describe("fragmentedSpiritOfFire starting sequence", () =>
  proveStartingGlimpse({ card: fragmentedSpiritOfFire, count: 6, draw: 6, summon: spiritShard }));
