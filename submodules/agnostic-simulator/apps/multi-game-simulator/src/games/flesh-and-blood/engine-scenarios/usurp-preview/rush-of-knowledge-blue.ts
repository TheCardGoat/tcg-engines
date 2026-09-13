import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/rush-of-knowledge.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rushOfKnowledgeBlue as rushOfKnowledgeBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/rush-of-knowledge";
import { prism as prismRules } from "@tcg/flesh-and-blood-cards/cards/heroes/prism";
import { ponder as ponderRules } from "@tcg/flesh-and-blood-cards/cards/tokens/ponder";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rushOfKnowledgeBlue = previewCard(rushOfKnowledgeBlueRules);
const prism = previewCard(prismRules);
const ponder = previewCard(ponderRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-rush-of-knowledge-blue",
  label: "Rush of Knowledge (blue)",
  description:
    "Printed ability and its legal choices. When this attacks, you may destroy a Ponder token you control. If you do, draw a card and gain 1 action point.\nPhantasm",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rush-of-knowledge-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const pay = true;

    const engine = FabTestEngine.start(
      { hero: prism, hand: [rushOfKnowledgeBlue], arena: [ponder], resourcePoints: 4, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(prism);
    player.play(rushOfKnowledgeBlue);
    game.advanceUntil({
      stopAt: "defend",
      optionals: pay ? "accept" : "decline",
      entityTargets: "maximum",
    });
    return matchFromEngine(engine, "usurp-preview-rush-of-knowledge-blue");
  },
};
