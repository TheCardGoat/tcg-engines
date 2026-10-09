import { describe } from "vitest";
import { jovialTinkerer } from "./jovial-tinkerer.ts";

import { cellReactor } from "../items/cell-reactor.ts";
import { proveControlledEntryCondition } from "../../../testing/controlled-entry-condition.ts";
import { veltechPresidentialCard } from "../../PRD/items/veltech-presidential-card.ts";
import { aquatechBladeX } from "../../PRD/weapons/aquatech-blade-x.ts";
/** @covers bKSlyTrW41-a1 */
describe("jovialTinkerer controlled entry condition", () =>
  proveControlledEntryCondition(jovialTinkerer, veltechPresidentialCard, aquatechBladeX, {
    draw: true,
    wrongSubtype: cellReactor,
  }));
