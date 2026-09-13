import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-swiftness.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { shadowrealmSwiftnessYellow as shadowrealmSwiftnessYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-swiftness";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const restlessMagisterRed = previewCard(restlessMagisterRedRules);
const snatchRed = previewCard(snatchRedRules);
const shadowrealmSwiftnessYellow = previewCard(shadowrealmSwiftnessYellowRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-swiftness-yellow",
  label: "Shadowrealm Swiftness (yellow)",
  description:
    "Moving a banished zombie arms the next attack with go again. You may put a card from your banished zone into your graveyard. If it's a zombie, your next attack this turn gets go again.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-swiftness-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmSwiftnessYellow, snatchRed],
        banished: [restlessMagisterRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Malice = engine.as(malice);
    Malice.play(shadowrealmSwiftnessYellow);
    engine.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    Malice.playAttack(snatchRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-shadowrealm-swiftness-yellow");
  },
};
