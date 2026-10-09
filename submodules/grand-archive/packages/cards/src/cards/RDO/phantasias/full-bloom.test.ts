import { describe } from "vitest";
import { fullBloom } from "./full-bloom.ts";

import { proveLineageEntrySummon } from "../../../testing/lineage-entry-summon.ts";
/** @covers 5WP1TXJo9E-a1
 * @covers 5WP1TXJo9E-a2
 */
describe("fullBloom champion entry bonus", () =>
  proveLineageEntrySummon(fullBloom, "Diao Chan", 4, { fullBloom: true }));
