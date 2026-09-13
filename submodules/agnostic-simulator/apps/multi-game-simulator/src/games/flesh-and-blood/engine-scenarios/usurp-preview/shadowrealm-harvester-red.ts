import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-harvester.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { shadowrealmHarvesterRed as shadowrealmHarvesterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-harvester";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const shadowrealmHarvesterRed = previewCard(shadowrealmHarvesterRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-harvester-red",
  label: "Shadowrealm Harvester (red)",
  description:
    "happy: from banished this is 7{p} with overpower. If this was played from your banished zone, it gets +1{p} and overpower.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-harvester-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmHarvesterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    game.as(levia).attackWith(shadowrealmHarvesterRed, { from: "banished" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-harvester-red");
  },
};
