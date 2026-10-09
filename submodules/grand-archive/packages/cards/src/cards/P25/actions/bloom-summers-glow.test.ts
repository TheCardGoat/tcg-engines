import { describe } from "vitest";
import { bloomSummersGlow } from "./bloom-summers-glow.ts";
import { proveBloomDiscardEmpower } from "../../../testing/bloom-discard-empower.ts";
/** @covers a708z5ethq-a2 */
describe("Bloom summers-glow — discard Empower", () => proveBloomDiscardEmpower(bloomSummersGlow));

import { lycoria } from "../../HVN/tokens/lycoria.ts";
import { baihua } from "../../HVN/tokens/baihua.ts";
import { proveBloomFlowerbudReplacement } from "../../../testing/bloom-flowerbud-replacement.ts";
/** @covers a708z5ethq-a1 */
describe("bloom-summers-glow — opposing Flowerbud replacement", () =>
  proveBloomFlowerbudReplacement(bloomSummersGlow, [lycoria, baihua]));

import { proveBloomEveryOpponent } from "../../../testing/bloom-flowerbud-replacement.ts";
/** @covers a708z5ethq-a1 */
describe("bloom-summers-glow — each opponent", () =>
  proveBloomEveryOpponent(bloomSummersGlow, [lycoria, baihua]));
