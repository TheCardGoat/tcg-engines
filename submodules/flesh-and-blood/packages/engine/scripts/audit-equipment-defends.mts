/**
 * Audit equipment-defend behavior from bench transcripts.
 *
 * Usage: node --experimental-transform-types --no-warnings scripts/audit-equipment-defends.mts reports/<tx-dir>
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";

const txDir = process.argv[2];
if (!txDir) throw new Error("usage: audit-equipment-defends.mts <transcripts-dir>");

const equipmentNames = new Set<string>();
for (const entry of fleshAndBloodDeckCardLibrary) {
  const base = (entry.runtime as unknown as { base?: { typeBox?: { types?: string[] } } }).base;
  if ((base?.typeBox?.types ?? []).includes("Equipment")) equipmentNames.add(entry.name);
}

interface Head {
  kind: string;
  score: number;
  label: string;
  defend?: readonly string[];
}
interface Frame {
  index: number;
  turnNumber: number;
  actorId: string;
  defending: boolean;
  life: number;
  opponentLife: number | null;
  equipment: readonly string[];
  remainingDamage: number | null;
  considered: readonly Head[];
  chosen: { move: string; label: string; score: number | null };
}
interface Transcript {
  seed: string;
  p1Deck: string;
  p2Deck: string;
  termination: string;
  winnerId: string | null;
  turnCount: number;
  frames: readonly Frame[];
}

const perCardDefends = new Map<string, number>();
const perCardContext = new Map<string, string[]>();
let defendFrames = 0;
let equipmentDefendFrames = 0;
let onHitishEquipmentDefends = 0;

for (const file of readdirSync(txDir).sort()) {
  if (!file.endsWith(".json")) continue;
  const tx = JSON.parse(readFileSync(join(txDir, file), "utf8")) as Transcript;
  for (const frame of tx.frames) {
    if (frame.chosen.move !== "defend") continue;
    if (frame.chosen.label === "Do not defend") continue;
    defendFrames += 1;
    // Names from the label: "Defend with A + B"
    const names = frame.chosen.label.replace(/^Defend with /, "").split(/ \+ /);
    const eq = names.filter((n) => equipmentNames.has(n));
    if (eq.length === 0) continue;
    equipmentDefendFrames += 1;
    const attackPower = frame.remainingDamage ?? 0;
    for (const name of eq) {
      perCardDefends.set(name, (perCardDefends.get(name) ?? 0) + 1);
      const line = `seed=${tx.seed} turn=${frame.turnNumber} life=${frame.life} remaining=${attackPower}`;
      perCardContext.set(name, [...(perCardContext.get(name) ?? []).slice(-3), line]);
    }
    if (attackPower >= 4) onHitishEquipmentDefends += 1;
  }
}

console.log(
  `defend frames: ${defendFrames}, with equipment: ${equipmentDefendFrames} (remaining>=4: ${onHitishEquipmentDefends})`,
);
const ranked = [...perCardDefends.entries()].sort((a, b) => b[1] - a[1]);
for (const [name, count] of ranked) {
  console.log(`${count}\t${name}`);
  for (const line of perCardContext.get(name) ?? []) console.log(`    ${line}`);
}
