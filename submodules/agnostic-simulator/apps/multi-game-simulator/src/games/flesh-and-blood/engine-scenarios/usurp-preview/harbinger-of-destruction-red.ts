import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/harbinger-of-destruction.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { hellboundAssaultYellow as hellboundAssaultYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";

import { harbingerOfDestructionRed as harbingerOfDestructionRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/harbinger-of-destruction";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const rhinar = previewCard(rhinarRules);
const dash = previewCard(dashRules);
const hellboundAssaultYellow = previewCard(hellboundAssaultYellowRules);

const harbingerOfDestructionRed = previewCard(harbingerOfDestructionRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-harbinger-of-destruction-red",
  label: "Harbinger of Destruction (red)",
  description:
    'happy: banishing a Shadow card as the cost arms 2 Gate tokens on hit. As an additional cost to play this, banish a card from your hand. If a Shadow card was banished this way, this gets "When this hits, create 2 Gate to i\'Arathael tokens."\nBlood Debt',
  group: "usurp-preview",
  tags: ["IAR", "preview", "harbinger-of-destruction-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [harbingerOfDestructionRed, hellboundAssaultYellow],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    game.as(dash);
    Rhinar.playAttack(harbingerOfDestructionRed);
    return matchFromEngine(engine, "usurp-preview-harbinger-of-destruction-red");
  },
};
