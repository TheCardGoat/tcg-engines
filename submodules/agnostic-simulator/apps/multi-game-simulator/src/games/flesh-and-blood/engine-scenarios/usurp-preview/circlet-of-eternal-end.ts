import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/circlet-of-eternal-end.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { hungeringDemigonYellow as hungeringDemigonYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/hungering-demigon";

import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { circletOfEternalEnd as circletOfEternalEndRules } from "@tcg/flesh-and-blood-cards/cards/equipment/circlet-of-eternal-end";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);
const hungeringDemigonYellow = previewCard(hungeringDemigonYellowRules);

const snatchRed = previewCard(snatchRedRules);
const circletOfEternalEnd = previewCard(circletOfEternalEndRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-circlet-of-eternal-end",
  label: "Circlet of Eternal End",
  description:
    "happy: when this defends, turn a card in the attacking hero's banished face-down. When this defends, turn a card in the attacking hero's banished zone face-down.\nBlade Break",
  group: "usurp-preview",
  tags: ["IAR", "preview", "circlet-of-eternal-end"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      { hero: bravo, life: 20, head: [circletOfEternalEnd], hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(circletOfEternalEnd);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    return matchFromEngine(engine, "usurp-preview-circlet-of-eternal-end");
  },
};
