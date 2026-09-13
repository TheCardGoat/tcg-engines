import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/abyssal-rush.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { abyssalRushBlue as abyssalRushBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/abyssal-rush";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);
const abyssalRushBlue = previewCard(abyssalRushBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-abyssal-rush-blue",
  label: "Abyssal Rush (blue)",
  description:
    'A hitting Shadow attack gets go again from the granted on-hit. You may play this from your banished zone.\nYour next Shadow attack this turn gets "When this hits, it gets go again." Go again\nBlood Debt',
  group: "usurp-preview",
  tags: ["IAR", "preview", "abyssal-rush-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        banished: [abyssalRushBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(abyssalRushBlue, { from: "banished" });
    engine.untilIdle();
    Chane.playAttack(unboundByShadowRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-abyssal-rush-blue");
  },
};
