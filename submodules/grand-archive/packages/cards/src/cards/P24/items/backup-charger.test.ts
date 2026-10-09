import { describe } from "vitest";
import { backupCharger } from "./backup-charger.ts";
import { proveBanishSummonMemory } from "../../../testing/banish-summon-memory.ts";
/** @covers 9gv4vm4kj3-a1 */
describe("Backup Charger's rested Powercell and memory draw", () =>
  proveBanishSummonMemory(backupCharger, "9gv4vm4kj3-a1", false));
