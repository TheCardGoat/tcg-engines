import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/satiate-bloodthirst.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { satiateBloodthirstRed as satiateBloodthirstRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/satiate-bloodthirst";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);
const satiateBloodthirstRed = previewCard(satiateBloodthirstRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-satiate-bloodthirst-red",
  label: "Satiate Bloodthirst (red)",
  description:
    "happy: banishing this from hand gains 1 life. Instant - Banish this from your hand: Gain 1{h}\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "satiate-bloodthirst-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [satiateBloodthirstRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.activate(satiateBloodthirstRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-satiate-bloodthirst-red");
  },
};
