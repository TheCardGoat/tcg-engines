import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/instants/wind-slicer.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { katsu as katsuRules } from "@tcg/flesh-and-blood-cards/cards/heroes/katsu";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { windSlicerBlue as windSlicerBlueRules } from "@tcg/flesh-and-blood-cards/cards/instants/wind-slicer";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const katsu = previewCard(katsuRules);
const bravo = previewCard(bravoRules);
const windSlicerBlue = previewCard(windSlicerBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-wind-slicer-blue",
  label: "Wind Slicer (blue)",
  description:
    "happy: the Shuriken attacks, refunds AP, and is destroyed when the chain closes. Legendary\nAction - {r}, {t}, destroy this when the combat chain closes: Attack. Go again\nWhen this hits a hero, they lose all hero card abilities during their next action phase",
  group: "usurp-preview",
  tags: ["IAR", "preview", "wind-slicer-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: katsu,
        hand: [windSlicerBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, life: 20, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Katsu = game.as(katsu);
    Katsu.play(windSlicerBlue);
    game.untilIdle({ ordering: "listed" });
    Katsu.activateAttack(windSlicerBlue);
    return matchFromEngine(engine, "usurp-preview-wind-slicer-blue");
  },
};
