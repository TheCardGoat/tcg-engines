import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/murmuring-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { murmuringGloombladeRed as murmuringGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/murmuring-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const murmuringGloombladeRed = previewCard(murmuringGloombladeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-murmuring-gloomblade-red",
  label: "Murmuring Gloomblade (red)",
  description:
    "Attacking creates a Runechant while this is still in combat. You may play this from your banished zone.\nUsurp\nWhen this attacks or hits, create a Runechant token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "murmuring-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [murmuringGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Viserai = engine.as(viserai);
    Viserai.playAttack(murmuringGloombladeRed);
    return matchFromEngine(engine, "usurp-preview-murmuring-gloomblade-red");
  },
};
