import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/instants/runechant-of-greed.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { vynnset as vynnsetRules } from "@tcg/flesh-and-blood-cards/cards/heroes/vynnset";
import { cleansingLightYellow as cleansingLightYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/cleansing-light";
import { runechantOfGreedYellow as runechantOfGreedYellowRules } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-greed";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const vynnset = previewCard(vynnsetRules);
const cleansingLightYellow = previewCard(cleansingLightYellowRules);
const runechantOfGreedYellow = previewCard(runechantOfGreedYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-runechant-of-greed-yellow",
  label: "Runechant of Greed (yellow)",
  description:
    "happy: destroyed by a yellow aura-destroy, a fresh Runechant is created. This counts as a Runechant. When an attack usurps this, draw a card.\nWhen this is destroyed, create a Runechant token.\nAt the beginning of your action phase or when you play an attack action card, destroy this.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "runechant-of-greed-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: vynnset,
        arena: [runechantOfGreedYellow],
        hand: [cleansingLightYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Vynnset = game.as(vynnset);

    Vynnset.play(cleansingLightYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: runechantOfGreedYellow.canonicalId });
    return matchFromEngine(engine, "usurp-preview-runechant-of-greed-yellow");
  },
};
