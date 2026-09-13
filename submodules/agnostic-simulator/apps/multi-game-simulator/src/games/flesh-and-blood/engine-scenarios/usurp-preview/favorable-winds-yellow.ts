import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/favorable-winds.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { marlynn as marlynnRules } from "@tcg/flesh-and-blood-cards/cards/heroes/marlynn";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { goldfinHarpoonYellow as goldfinHarpoonYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/goldfin-harpoon";
import { favorableWindsYellow as favorableWindsYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/favorable-winds";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const marlynn = previewCard(marlynnRules);
const dash = previewCard(dashRules);
const goldfinHarpoonYellow = previewCard(goldfinHarpoonYellowRules);
const favorableWindsYellow = previewCard(favorableWindsYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-favorable-winds-yellow",
  label: "Favorable Winds (yellow)",
  description:
    "happy: discarding a Goldfin Harpoon draws 2 and refunds the action point. As an additional cost to play this, discard a Goldfin Harpoon.\nDraw 2 cards.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "favorable-winds-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [favorableWindsYellow, goldfinHarpoonYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Marlynn = game.as(marlynn);
    Marlynn.play(favorableWindsYellow);
    game.untilIdle({ optionals: "decline" });
    return matchFromEngine(engine, "usurp-preview-favorable-winds-yellow");
  },
};
