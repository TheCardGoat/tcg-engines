import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/tokens/gate-to-i-arathael.test.ts.
import { fabToken, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-gate-to-i-arathael",
  label: "Gate to i'Arathael",
  description:
    "happy: destroying the gate permits playing the targeted blood-debt action from the banished zone. Instant - {r}, destroy this: You may play target action card with blood debt from your banished zone this turn.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "gate-to-i-arathael"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        arena: [fabToken("gate-to-i-arathael")],
        banished: [unboundByShadowRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.activate(fabToken("gate-to-i-arathael"));
    Chane.target(unboundByShadowRed);
    game.helpers.untilIdle({ optionals: "accept", ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-gate-to-i-arathael");
  },
};
