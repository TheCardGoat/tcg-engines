import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/hellbound-assault.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";

import { hellboundAssaultRed as hellboundAssaultRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);

const hellboundAssaultRed = previewCard(hellboundAssaultRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-hellbound-assault-red",
  label: "Hellbound Assault (red)",
  description:
    "happy: when this hits, it is banished instead of resting in the graveyard. When this hits, banish it.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "hellbound-assault-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [hellboundAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    Rhinar.playAttack(hellboundAssaultRed);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-hellbound-assault-red");
  },
};
