import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/malice-domina-of-the-dead.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";

import { maliceDominaOfTheDead as maliceDominaOfTheDeadRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice-domina-of-the-dead";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const restlessMagisterRed = previewCard(restlessMagisterRedRules);

const maliceDominaOfTheDead = previewCard(maliceDominaOfTheDeadRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-malice-domina-of-the-dead",
  label: "Malice, Domina of the Dead",
  description:
    "happy: {r},{t} lets you play a graveyard Zombie this turn, then go again. Action - {r}, {t}: Until end of turn, you may play target zombie from your graveyard. Go again\nWhenever a zombie you control dies, banish it face-down and create a Corrupted Corpse in your banished Zone.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "malice-domina-of-the-dead"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: maliceDominaOfTheDead,
        graveyard: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(maliceDominaOfTheDead);
    Malice.activate(maliceDominaOfTheDead);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-malice-domina-of-the-dead");
  },
};
