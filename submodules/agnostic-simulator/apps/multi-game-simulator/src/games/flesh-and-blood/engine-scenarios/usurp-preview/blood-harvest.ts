import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/blood-harvest.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { bloodHarvest as bloodHarvestRules } from "@tcg/flesh-and-blood-cards/cards/actions/blood-harvest";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);

const bloodHarvest = previewCard(bloodHarvestRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-blood-harvest",
  label: "Blood Harvest",
  description:
    "happy: Instant banish from hand gains 3 resources. Instant - Banish this from your hand: Gain {r}{r}{r}\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "blood-harvest"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [bloodHarvest],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.activate(bloodHarvest);
    game.untilIdle({ entityTargets: "minimum" });
    return matchFromEngine(engine, "usurp-preview-blood-harvest");
  },
};
