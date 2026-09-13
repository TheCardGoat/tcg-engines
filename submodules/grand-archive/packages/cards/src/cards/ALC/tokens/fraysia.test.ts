import { describe } from "vitest";

import { proveSacrificeRecovery } from "../../../testing/sacrifice-recovery.ts";
import { fraysia } from "./fraysia.ts";

/** @covers soporhlq2k-a1 */
describe("fraysia — Recover 1", () => {
  proveSacrificeRecovery({ card: fraysia, abilityId: "soporhlq2k-a1", amount: 1 });
});
