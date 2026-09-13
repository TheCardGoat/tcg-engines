import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/bridge-of-damnation.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";

import { bridgeOfDamnationBlue as bridgeOfDamnationBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/bridge-of-damnation";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);

const bridgeOfDamnationBlue = previewCard(bridgeOfDamnationBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-bridge-of-damnation-blue",
  label: "Bridge of Damnation (blue)",
  description:
    "happy: playing this refunds the action point (go again). Go again\nAt the start of each turn, destroy this unless you put a zombie from your banished zone into your graveyard.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bridge-of-damnation-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bridgeOfDamnationBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    Bravo.play(bridgeOfDamnationBlue);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-bridge-of-damnation-blue");
  },
};
