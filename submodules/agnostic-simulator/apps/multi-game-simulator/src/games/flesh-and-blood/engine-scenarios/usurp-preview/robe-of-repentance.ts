import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/robe-of-repentance.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { hungeringDemigonYellow as hungeringDemigonYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/hungering-demigon";

import { robeOfRepentance as robeOfRepentanceRules } from "@tcg/flesh-and-blood-cards/cards/equipment/robe-of-repentance";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);
const hungeringDemigonYellow = previewCard(hungeringDemigonYellowRules);

const robeOfRepentance = previewCard(robeOfRepentanceRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-robe-of-repentance",
  label: "Robe of Repentance",
  description:
    "happy: destroy this, turn your blood-debt banished card face-down, and skip the end-phase tax. Instant - Destroy this: Turn a card with blood debt in your banished zone face-down.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "robe-of-repentance"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        chest: [robeOfRepentance],
        banished: [hungeringDemigonYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    Bravo.activate(robeOfRepentance);
    return matchFromEngine(engine, "usurp-preview-robe-of-repentance");
  },
};
