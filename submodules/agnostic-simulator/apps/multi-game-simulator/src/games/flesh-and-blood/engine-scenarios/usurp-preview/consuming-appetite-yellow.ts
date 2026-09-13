import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/consuming-appetite.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { consumingAppetiteYellow as consumingAppetiteYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/consuming-appetite";
import { blasmophetTheInsatiableHunger as blasmophetTheInsatiableHungerRules } from "@tcg/flesh-and-blood-cards/cards/tokens/blasmophet-the-insatiable-hunger";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);
const consumingAppetiteYellow = previewCard(consumingAppetiteYellowRules);
const blasmophetTheInsatiableHunger = previewCard(blasmophetTheInsatiableHungerRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-consuming-appetite-yellow",
  label: "Consuming Appetite (yellow)",
  description:
    'happy: banishing this from hand lets a Blasmophet token attack with go again. Instant - {r}, banish this from your hand: Until end of turn, Blasmophet, the Insatiable Hunger tokens you control get "Action - {t}: Attack. Go again"\nBlood Debt',
  group: "usurp-preview",
  tags: ["IAR", "preview", "consuming-appetite-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingAppetiteYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.activate(consumingAppetiteYellow);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-consuming-appetite-yellow");
  },
};
