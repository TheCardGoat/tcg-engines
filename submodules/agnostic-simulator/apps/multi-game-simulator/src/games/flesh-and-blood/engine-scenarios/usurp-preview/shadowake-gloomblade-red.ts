import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowake-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { shadowakeGloombladeRed as shadowakeGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowake-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const shadowakeGloombladeRed = previewCard(shadowakeGloombladeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowake-gloomblade-red",
  label: "Shadowake Gloomblade (red)",
  description:
    "A hit creates a Gate to i'Arathael. You may play this from your banished zone.\nUsurp\nWhen this hits, create a Gate to i'Arathael token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowake-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [shadowakeGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Viserai = engine.as(viserai);
    const Dash = engine.as(dash);
    Viserai.playAttack(shadowakeGloombladeRed);
    Dash.defendWith();
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-shadowake-gloomblade-red");
  },
};
