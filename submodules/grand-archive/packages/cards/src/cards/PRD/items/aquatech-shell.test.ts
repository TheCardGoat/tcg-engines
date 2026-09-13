import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { aquatechShell } from "./aquatech-shell.ts";

/** @covers QZT9pQQltw-a3 */
describe("AquaTech Shell — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: aquatechShell });
});
