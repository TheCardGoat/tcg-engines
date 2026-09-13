import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-plowman.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessPlowmanRed as restlessPlowmanRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-plowman";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const restlessPlowmanRed = previewCard(restlessPlowmanRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-plowman-red",
  label: "Restless Plowman (red)",
  description:
    "Tapping the plowman gains {r} and refunds the action point. Action - {t}: Gain {r}. Go again\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-plowman-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessPlowmanRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Malice = engine.as(malice);
    Malice.activate(restlessPlowmanRed);
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-restless-plowman-red");
  },
};
