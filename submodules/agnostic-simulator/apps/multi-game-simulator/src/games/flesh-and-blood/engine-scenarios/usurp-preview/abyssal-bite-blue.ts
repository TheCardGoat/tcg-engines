import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/abyssal-bite.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { abyssalBiteBlue as abyssalBiteBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/abyssal-bite";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);
const abyssalBiteBlue = previewCard(abyssalBiteBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-abyssal-bite-blue",
  label: "Abyssal Bite (blue)",
  description:
    "Playing this from banished arms the next Shadow attack with +1{p}. You may play this from your banished zone.\nYour next Shadow attack this turn gets +1{p}. Go again\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "abyssal-bite-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        banished: [abyssalBiteBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(abyssalBiteBlue, { from: "banished" });
    engine.untilIdle();
    Chane.playAttack(unboundByShadowRed);
    return matchFromEngine(engine, "usurp-preview-abyssal-bite-blue");
  },
};
