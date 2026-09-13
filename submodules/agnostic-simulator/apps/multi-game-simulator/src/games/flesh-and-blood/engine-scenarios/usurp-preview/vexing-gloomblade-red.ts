import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/vexing-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";

import { vexingGloombladeRed as vexingGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/vexing-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);

const vexingGloombladeRed = previewCard(vexingGloombladeRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-vexing-gloomblade-red",
  label: "Vexing Gloomblade (red)",
  description:
    "happy: a hitting gloomblade adds 2 arcane damage to its physical hit. You may play this from your banished zone.\nUsurp\nWhen this hits a hero, deal 2 arcane damage to any target.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "vexing-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vexingGloombladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.playAttack(vexingGloombladeRed);
    Dash.defendWith();
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Viserai.targetRequired(Dash);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-vexing-gloomblade-red");
  },
};
