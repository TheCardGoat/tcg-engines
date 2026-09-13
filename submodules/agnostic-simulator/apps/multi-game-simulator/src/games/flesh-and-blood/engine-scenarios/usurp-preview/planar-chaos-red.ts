import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/planar-chaos.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { planarChaosRed as planarChaosRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/planar-chaos";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const planarChaosRed = previewCard(planarChaosRedRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-planar-chaos-red",
  label: "Planar Chaos (red)",
  description:
    "creates a Gate and lets its controller target and play an opponent's banished blood-debt action. Create a Gate to i'Arathael token.\nThe next Gate to i'Arathael token you activate this turn can target an action card with blood debt in any banished zone.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "planar-chaos-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: chane, hand: [planarChaosRed], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], banished: [unboundByShadowRed], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    game.as(dash).cardIn("banished", unboundByShadowRed);
    player.play(planarChaosRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-planar-chaos-red");
  },
};
