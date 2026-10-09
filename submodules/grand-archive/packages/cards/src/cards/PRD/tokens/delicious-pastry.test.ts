import { describe } from "vitest";
import { deliciousPastry } from "./delicious-pastry.ts";
import { proveSacrificeRecovery } from "../../../testing/sacrifice-recovery.ts";
/** @covers tCTH0Bpfr5-a1 */
describe("delicious-pastry — sacrifice recovery", () =>
  proveSacrificeRecovery({ card: deliciousPastry, abilityId: "tCTH0Bpfr5-a1", amount: 2 }));

import { proveSacrificeBuff } from "../../../testing/sacrifice-buff.ts";
/** @covers tCTH0Bpfr5-a2 */
describe("Delicious Pastry's sacrifice buff", () =>
  proveSacrificeBuff(deliciousPastry, "tCTH0Bpfr5-a2", 2, "tCTH0Bpfr5-a1"));
