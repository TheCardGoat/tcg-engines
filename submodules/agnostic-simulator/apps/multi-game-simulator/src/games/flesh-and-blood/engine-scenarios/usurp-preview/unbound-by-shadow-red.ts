import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/unbound-by-shadow.test.ts.
import { FabTestEngine, fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-unbound-by-shadow-red",
  label: "Unbound by Shadow (red)",
  description:
    "happy: Gate permission then attacking from banished creates a Gate token. When this attacks, if it was played from your banished zone, create a Gate to i'Arathael token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "unbound-by-shadow-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [unboundByShadowRed],
        arena: [fabToken("gate-to-i-arathael")],
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
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Chane.playAttack(unboundByShadowRed, { from: "banished", stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-unbound-by-shadow-red");
  },
};
