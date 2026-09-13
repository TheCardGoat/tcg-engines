import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/sinspeaker-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { runechantOfLustYellow as runechantOfLust } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-lust";
import { sinspeakerGloombladeRed as sinspeakerGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/sinspeaker-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const sinspeakerGloombladeRed = previewCard(sinspeakerGloombladeRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-sinspeaker-gloomblade-red",
  label: "Sinspeaker Gloomblade (red)",
  description:
    'happy: playing from banished searches a Runechant aura into the arena. You may play this from your banished zone.\nUsurp\nIf this was played from your banished zone, it gets "When this attacks, you may search your deck for an aura with Runechant in its name, put it into the arena, then shuffle."\nBlood Debt',
  group: "usurp-preview",
  tags: ["IAR", "preview", "sinspeaker-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        banished: [sinspeakerGloombladeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [runechantOfLust],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.playAttack(sinspeakerGloombladeRed, {
      from: "banished",
      optionals: "accept",
      entityTargets: "pause",
    });
    Chane.target(Chane.cardIn("deck", runechantOfLust));
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    return matchFromEngine(engine, "usurp-preview-sinspeaker-gloomblade-red");
  },
};
