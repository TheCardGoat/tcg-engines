import { describe } from "vitest";
import { elysianOrphan } from "./elysian-orphan.ts";

import { proveElysianAura } from "../../../testing/elysian-aura.ts";
/** @covers RN7ueRDijA-a1 */
describe("elysian-orphan — Elysian Aura", () => {
  proveElysianAura(elysianOrphan);
});
