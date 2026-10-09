import { describe } from "vitest";
import { bloomAutumnsFall } from "./bloom-autumns-fall.ts";
import { proveBloomDiscardEmpower } from "../../../testing/bloom-discard-empower.ts";
/** @covers pebu7agtcd-a2 */
describe("Bloom autumns-fall — discard Empower", () => proveBloomDiscardEmpower(bloomAutumnsFall));

import { acerbica } from "../../HVN/tokens/acerbica.ts";
import { washuru } from "../../HVN/tokens/washuru.ts";
import { proveBloomFlowerbudReplacement } from "../../../testing/bloom-flowerbud-replacement.ts";
/** @covers pebu7agtcd-a1 */
describe("bloom-autumns-fall — opposing Flowerbud replacement", () =>
  proveBloomFlowerbudReplacement(bloomAutumnsFall, [acerbica, washuru]));

import { proveBloomEveryOpponent } from "../../../testing/bloom-flowerbud-replacement.ts";
/** @covers pebu7agtcd-a1 */
describe("bloom-autumns-fall — each opponent", () =>
  proveBloomEveryOpponent(bloomAutumnsFall, [acerbica, washuru]));
