import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/demonbound-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { demonboundGloombladeRed as demonboundGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/demonbound-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const demonboundGloombladeRed = previewCard(demonboundGloombladeRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-demonbound-gloomblade-red",
  label: "Demonbound Gloomblade (red)",
  description:
    "timing: Blood Debt — a copy left in banished costs 1 life at the end phase. You may play this from your banished zone.\nUsurp\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "demonbound-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: viserai, hand: [], banished: [demonboundGloombladeRed], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viserai);
    Viserai.endTurn();
    game.helpers.untilIdle();
    return matchFromEngine(engine, "usurp-preview-demonbound-gloomblade-red");
  },
};
