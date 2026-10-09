import { describe } from "vitest";
import { acheronExpressOfficer } from "./acheron-express-officer.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 9fRWmhqsNS-a1 */
describe("Acheron Express Officer Ranged", () => {
  proveRangedAlly({ card: acheronExpressOfficer, power: 1, ranged: 3, classBonus: false });
});

import { proveControlledEntryCondition } from "../../../testing/controlled-entry-condition.ts";
import { hydrocaskDroid } from "../../PRD/allies/hydrocask-droid.ts";
import { cellReactor } from "../../PRD/items/cell-reactor.ts";
/** @covers 9fRWmhqsNS-a2 */
describe("acheronExpressOfficer controlled entry condition", () =>
  proveControlledEntryCondition(acheronExpressOfficer, hydrocaskDroid, cellReactor, { ranged: 3 }));
