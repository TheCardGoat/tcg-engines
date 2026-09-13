import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/commit-to-corruption.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { commitToCorruptionRed as commitToCorruptionRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/commit-to-corruption";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const commitToCorruptionRed = previewCard(commitToCorruptionRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-commit-to-corruption-red",
  label: "Commit to Corruption (red)",
  description:
    'The next attack hits and creates a Corrupted Corpse in the banished zone. Your next attack this turn gets +3{p} and "When this hits, create a Corrupted Corpse in your banished zone."\nGo again',
  group: "usurp-preview",
  tags: ["IAR", "preview", "commit-to-corruption-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [commitToCorruptionRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Malice = engine.as(malice);
    Malice.play(commitToCorruptionRed);
    engine.untilIdle();
    Malice.playAttack(brutalAssaultBlue);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-commit-to-corruption-red");
  },
};
