import { describe } from "vitest";
import { biseBlade } from "./bise-blade.ts";

import { proveLineageEntrySummon } from "../../../testing/lineage-entry-summon.ts";
/** @covers aZzm2GEWEu-a1 */
describe("biseBlade champion entry bonus", () =>
  proveLineageEntrySummon(biseBlade, "Ciel", 1, { servant: true }));
