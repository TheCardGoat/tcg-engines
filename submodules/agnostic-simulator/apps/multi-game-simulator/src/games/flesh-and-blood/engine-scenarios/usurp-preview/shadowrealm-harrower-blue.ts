import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-harrower.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { shadowrealmHarrowerBlue as shadowrealmHarrowerBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-harrower";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const shadowrealmHarrowerBlue = previewCard(shadowrealmHarrowerBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-harrower-blue",
  label: "Shadowrealm Harrower (blue)",
  description:
    'happy: from banished this is 5{p} and gains life equal to the hit. If this was played from your banished zone, it gets +1{p} and "When this hits a hero, gain {h} equal to the damage dealt this way."\nBlood Debt',
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-harrower-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmHarrowerBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.attackWith(shadowrealmHarrowerBlue, { from: "banished" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-harrower-blue");
  },
};
