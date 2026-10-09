import { describe } from "vitest";
import { exquisiteDessert } from "./exquisite-dessert.ts";
import { proveSacrificeRecovery } from "../../../testing/sacrifice-recovery.ts";
/** @covers 5HPvGPjsD9-a1 */
describe("exquisite-dessert — sacrifice recovery", () =>
  proveSacrificeRecovery({ card: exquisiteDessert, abilityId: "5HPvGPjsD9-a1", amount: 4 }));

import { proveSacrificeBuff } from "../../../testing/sacrifice-buff.ts";
/** @covers 5HPvGPjsD9-a2 */
describe("Exquisite Dessert's sacrifice buff", () =>
  proveSacrificeBuff(exquisiteDessert, "5HPvGPjsD9-a2", 1, "5HPvGPjsD9-a1"));
