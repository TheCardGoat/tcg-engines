import { describe } from "vitest";
import { thanatoticHemosynth } from "./thanatotic-hemosynth.ts";

import { proveElysianAura } from "../../../testing/elysian-aura.ts";
/** @covers MKiuesDVdW-a1 */
describe("thanatotic-hemosynth — Elysian Aura", () => {
  proveElysianAura(thanatoticHemosynth);
});
