import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { exorcismRed as exorcismRules } from "@tcg/flesh-and-blood-cards/cards/actions/exorcism";
import { snatchRed as snatchRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { unboundByShadowRed as unboundRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const exorcismRed = previewCard(exorcismRules);
const snatchRed = previewCard(snatchRules);
const unboundByShadowRed = previewCard(unboundRules);
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-exorcism-red",
  label: "Exorcism (red)",
  description:
    "Paused at Defend with Exorcism's +3 power applied to Snatch. Let the attack hit to turn the defending hero's banished card face-down.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "exorcism-red", "next-attack", "banished", "face-down"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [exorcismRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], banished: [unboundByShadowRed], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(dash);
    player.play(exorcismRed);
    engine.untilIdle();
    player.playAttack(snatchRed);
    return matchFromEngine(engine, "usurp-preview-exorcism-red");
  },
};
