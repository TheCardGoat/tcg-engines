import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/dimenxxional-ferryman.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";

import { dimenxxionalFerrymanBlue as dimenxxionalFerrymanBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/dimenxxional-ferryman";
import { hellboundAssaultRed as hellboundAssaultRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);

const dimenxxionalFerrymanBlue = previewCard(dimenxxionalFerrymanBlueRules);
const hellboundAssaultRed = previewCard(hellboundAssaultRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-dimenxxional-ferryman-blue",
  label: "Dimenxxional Ferryman (blue)",
  description:
    "returns itself and a blood-debt action from banishment to the deck. Put this and an action card with blood debt from your banished zone on the bottom of your deck.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "dimenxxional-ferryman-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalFerrymanBlue],
        banished: [hellboundAssaultRed],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    player.cardIn("hand", dimenxxionalFerrymanBlue);
    player.cardIn("banished", hellboundAssaultRed);
    player.play(dimenxxionalFerrymanBlue);
    game.untilIdle({ entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-dimenxxional-ferryman-blue");
  },
};
