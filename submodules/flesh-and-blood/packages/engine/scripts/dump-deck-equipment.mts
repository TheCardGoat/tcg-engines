import { getFabDeckTextFixture } from "../src/automation/deck-text-fixtures.ts";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";

const byName = new Map(fleshAndBloodDeckCardLibrary.map((e) => [e.name, e]));
for (const deckId of process.argv.slice(2)) {
  const fixture = getFabDeckTextFixture(deckId);
  console.log(`## ${deckId} — ${fixture.hero}`);
  for (const raw of fixture.arena.split("\n")) {
    const name = raw.replace(/^\d+x\s*/, "").trim();
    if (!name) continue;
    const entry = byName.get(name);
    if (!entry) {
      console.log(`  ?? ${name}`);
      continue;
    }
    const base = (
      entry.runtime as unknown as {
        base?: {
          typeBox?: { types?: string[] };
          keywords?: string[];
          abilities?: readonly Record<string, unknown>[];
        };
      }
    ).base;
    console.log(`  ${name} keywords=${JSON.stringify(base?.keywords ?? [])}`);
    for (const a of base?.abilities ?? []) {
      console.log(
        `    [${a.kind}${a.abilityType ? "/" + a.abilityType : ""}] ${String(a.text).slice(0, 130)}`,
      );
    }
  }
}
