import { describe } from "vitest";
import { elysianAspirant } from "./elysian-aspirant.ts";

import { proveElysianAura } from "../../../testing/elysian-aura.ts";
/** @covers HHtlkEeyQR-a1 */
/** @covers HHtlkEeyQR-a2 */
describe("elysian-aspirant — Elysian Aura", () => {
  proveElysianAura(elysianAspirant, 1);
});
