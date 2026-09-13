import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/bloodfrenzy-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { bloodfrenzyGloombladeRed as bloodfrenzyGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/bloodfrenzy-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const snatchRed = previewCard(snatchRedRules);
const bloodfrenzyGloombladeRed = previewCard(bloodfrenzyGloombladeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-bloodfrenzy-gloomblade-red",
  label: "Bloodfrenzy Gloomblade (red)",
  description:
    "After dealing damage this turn the gloomblade has go again. You may play this from your banished zone.\nUsurp\nIf you've dealt damage to the defending hero this turn, this gets go again.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bloodfrenzy-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [snatchRed, bloodfrenzyGloombladeRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Viserai = engine.as(viserai);
    const Dash = engine.as(dash);
    Viserai.playAttack(snatchRed);
    Dash.defendWith();
    engine.closeCombat();
    Viserai.playAttack(bloodfrenzyGloombladeRed);
    return matchFromEngine(engine, "usurp-preview-bloodfrenzy-gloomblade-red");
  },
};
