import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/cleave-the-heavens.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { cleaveTheHeavensRed as cleaveTheHeavensRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/cleave-the-heavens";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);
const cleaveTheHeavensRed = previewCard(cleaveTheHeavensRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-cleave-the-heavens-red",
  label: "Cleave the Heavens (red)",
  description:
    "happy: banishing this from hand creates a Gate to i'Arathael. Instant - Banish this from your hand: Create a Gate to i'Arathael token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "cleave-the-heavens-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [cleaveTheHeavensRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.activate(cleaveTheHeavensRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-cleave-the-heavens-red");
  },
};
