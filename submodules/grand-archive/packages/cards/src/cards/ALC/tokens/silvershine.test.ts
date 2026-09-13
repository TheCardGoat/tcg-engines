import { describe } from "vitest";

import { proveSacrificeRecovery } from "../../../testing/sacrifice-recovery.ts";
import { silvershine } from "./silvershine.ts";

/** @covers bd7ozuj68m-a1 */
describe("silvershine — Recover 1", () => {
  proveSacrificeRecovery({ card: silvershine, abilityId: "bd7ozuj68m-a1", amount: 1 });
});
