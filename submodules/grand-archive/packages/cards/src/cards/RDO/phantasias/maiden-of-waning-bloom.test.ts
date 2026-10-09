import { describe } from "vitest";
import { maidenOfWaningBloom } from "./maiden-of-waning-bloom.ts";

import { proveLineageEntrySummon } from "../../../testing/lineage-entry-summon.ts";
/** @covers xkzLY4vWMk-a1 */
describe("maidenOfWaningBloom champion entry bonus", () =>
  proveLineageEntrySummon(maidenOfWaningBloom, "Diao Chan", 2, { optionalTarget: true }));
