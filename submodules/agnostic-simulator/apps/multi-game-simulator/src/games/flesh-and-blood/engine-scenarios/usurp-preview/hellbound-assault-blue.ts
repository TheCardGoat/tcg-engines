import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/hellbound-assault.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";

import { hellboundAssaultBlue as hellboundAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);

const hellboundAssaultBlue = previewCard(hellboundAssaultBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-hellbound-assault-blue",
  label: "Hellbound Assault (blue)",
  description:
    "happy: when this hits, it is banished instead of resting in the graveyard. When this hits, banish it.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "hellbound-assault-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [hellboundAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    Rhinar.playAttack(hellboundAssaultBlue);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-hellbound-assault-blue");
  },
};
