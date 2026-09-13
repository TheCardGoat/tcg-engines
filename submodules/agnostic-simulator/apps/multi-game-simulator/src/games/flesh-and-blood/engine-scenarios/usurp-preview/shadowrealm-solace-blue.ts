import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-solace.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { shadowrealmSolaceBlue as shadowrealmSolaceBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-solace";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const restlessMagisterRed = previewCard(restlessMagisterRedRules);
const shadowrealmSolaceBlue = previewCard(shadowrealmSolaceBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-solace-blue",
  label: "Shadowrealm Solace (blue)",
  description:
    "Accepting the zombie move gains 1{h} and refunds the action point. You may put a card from your banished zone into your graveyard. If it's a zombie, gain 1{h}.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-solace-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmSolaceBlue],
        banished: [restlessMagisterRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Malice = engine.as(malice);
    Malice.play(shadowrealmSolaceBlue);
    engine.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-solace-blue");
  },
};
