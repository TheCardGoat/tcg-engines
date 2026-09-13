import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-reaper.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { shadowrealmReaperYellow as shadowrealmReaperYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-reaper";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const shadowrealmReaperYellow = previewCard(shadowrealmReaperYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-reaper-yellow",
  label: "Shadowrealm Reaper (yellow)",
  description:
    "happy: from banished this is 6{p} with go again. If this was played from your banished zone, it gets +1{p} and go again.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-reaper-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowrealmReaperYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.attackWith(shadowrealmReaperYellow, { from: "banished" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-reaper-yellow");
  },
};
