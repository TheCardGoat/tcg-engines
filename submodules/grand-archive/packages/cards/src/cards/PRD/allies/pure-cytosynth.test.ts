import { describe } from "vitest";
import { pureCytosynth } from "./pure-cytosynth.ts";

import { proveElysianAura } from "../../../testing/elysian-aura.ts";
/** @covers 172utOanGk-a2 */
describe("pure-cytosynth — Elysian Aura", () => {
  proveElysianAura(pureCytosynth);
});
