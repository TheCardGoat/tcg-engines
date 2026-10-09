import { describe } from "vitest";
import { bloomWintersChill } from "./bloom-winters-chill.ts";
import { proveBloomDiscardEmpower } from "../../../testing/bloom-discard-empower.ts";
/** @covers b4jvyh23y1-a2 */
describe("Bloom winters-chill — discard Empower", () =>
  proveBloomDiscardEmpower(bloomWintersChill));

import { nightshade } from "../../HVN/tokens/nightshade.ts";
import { floodbloom } from "../../HVN/tokens/floodbloom.ts";
import { proveBloomFlowerbudReplacement } from "../../../testing/bloom-flowerbud-replacement.ts";
/** @covers b4jvyh23y1-a1 */
describe("bloom-winters-chill — opposing Flowerbud replacement", () =>
  proveBloomFlowerbudReplacement(bloomWintersChill, [nightshade, floodbloom]));

import { proveBloomEveryOpponent } from "../../../testing/bloom-flowerbud-replacement.ts";
/** @covers b4jvyh23y1-a1 */
describe("bloom-winters-chill — each opponent", () =>
  proveBloomEveryOpponent(bloomWintersChill, [nightshade, floodbloom]));
