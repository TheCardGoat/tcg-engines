import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/deadly-spinneret.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { arakni as arakniRules } from "@tcg/flesh-and-blood-cards/cards/heroes/arakni";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { deadlySpinneretRed as deadlySpinneretRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/deadly-spinneret";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const arakni = previewCard(arakniRules);
const dash = previewCard(dashRules);

const deadlySpinneretRed = previewCard(deadlySpinneretRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-deadly-spinneret-red",
  label: "Deadly Spinneret (red)",
  description:
    "discards itself to fill both empty weapon zones. Stealth\nInstant - Discard this: Equip a Graphene Chelicera token to each of your empty weapon zones.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "deadly-spinneret-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: arakni, hand: [deadlySpinneretRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    game.as(arakni).activate(deadlySpinneretRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-deadly-spinneret-red");
  },
};
