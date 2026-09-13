import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-cleric.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const restlessClericRed = previewCard(restlessClericRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-cleric-red",
  label: "Restless Cleric (red)",
  description:
    "happy: tapping the cleric gains 1{h} and the go again refunds the action point. Action - {t}: Gain 1{h}. Go again\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-cleric-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessClericRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    Malice.activate(restlessClericRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-restless-cleric-red");
  },
};
