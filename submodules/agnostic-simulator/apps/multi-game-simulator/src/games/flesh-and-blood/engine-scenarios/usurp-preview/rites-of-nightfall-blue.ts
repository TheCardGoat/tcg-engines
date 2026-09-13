import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/rites-of-nightfall.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { ritesOfNightfallBlue as ritesOfNightfallBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/rites-of-nightfall";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const ritesOfNightfallBlue = previewCard(ritesOfNightfallBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-rites-of-nightfall-blue",
  label: "Rites of Nightfall (blue)",
  description:
    "Playing this creates a Gate and refunds the action point. Create a Gate to i'Arathael token.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rites-of-nightfall-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [ritesOfNightfallBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(ritesOfNightfallBlue);
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-rites-of-nightfall-blue");
  },
};
