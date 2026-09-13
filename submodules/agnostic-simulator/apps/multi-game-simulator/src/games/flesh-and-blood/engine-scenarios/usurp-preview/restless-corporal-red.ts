import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-corporal.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessCorporalRed as restlessCorporalRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import {
  hellboundAssaultRed as hellboundAssaultRedRules,
  hellboundAssaultBlue as hellboundAssaultBlueRules,
} from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const restlessCorporalRed = previewCard(restlessCorporalRedRules);
const hellboundAssaultRed = previewCard(hellboundAssaultRedRules);
const hellboundAssaultBlue = previewCard(hellboundAssaultBlueRules);
const malice = previewCard(maliceRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-corporal-red",
  label: "Restless Corporal (red)",
  description:
    "Choose your banished Hellbound Assault in the focused picker; the opposing copy is ineligible. Action - {t}: Put a card from your banished zone into your graveyard. Go again\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-corporal-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [],
        arena: [restlessCorporalRed],
        banished: [hellboundAssaultRed, hellboundAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [], banished: [hellboundAssaultRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(malice);
    player.activate(restlessCorporalRed);
    return matchFromEngine(engine, "usurp-preview-restless-corporal-red");
  },
};
