import { describe } from "vitest";
import { slimecallCyclone } from "./slimecall-cyclone.ts";

import { proveClassPhaseSummon } from "../../../testing/class-phase-summon.ts";
import { babySlime } from "../tokens/baby-slime.ts";
/** @covers 9Kgr2prI9E-a1 */
describe("slimecallCyclone phase summon", () =>
  proveClassPhaseSummon(slimecallCyclone, babySlime, "recollection", false));
