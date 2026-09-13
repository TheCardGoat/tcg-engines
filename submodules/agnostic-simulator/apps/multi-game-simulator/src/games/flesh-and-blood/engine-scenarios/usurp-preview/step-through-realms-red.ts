import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/step-through-realms.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { stepThroughRealmsRed as stepThroughRealmsRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/step-through-realms";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);
const stepThroughRealmsRed = previewCard(stepThroughRealmsRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-step-through-realms-red",
  label: "Step through Realms (red)",
  description:
    'The next Shadow attack hits for extra power and creates a Gate. Your next Shadow attack this turn gets +4{p} and "When this hits, create a Gate to i\'Arathael token."\nGo again',
  group: "usurp-preview",
  tags: ["IAR", "preview", "step-through-realms-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [stepThroughRealmsRed, unboundByShadowRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(stepThroughRealmsRed);
    engine.untilIdle();
    Chane.playAttack(unboundByShadowRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-step-through-realms-red");
  },
};
