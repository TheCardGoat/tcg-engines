import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/plundersong-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { plundersongGloombladeRed as plundersongGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/plundersong-gloomblade";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const plundersongGloombladeRed = previewCard(plundersongGloombladeRedRules);
const chane = previewCard(chaneRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-plundersong-gloomblade-red",
  label: "Plundersong Gloomblade (red)",
  description:
    "Printed ability and its legal choices. You may play this from your banished zone.\nUsurp\nWhen this hits a hero, they banish a card in their arsenal.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "plundersong-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const from = "banished";

    const engine = FabTestEngine.start(
      { hero: chane, hand: [], [from]: [plundersongGloombladeRed], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], arsenal: [brutalAssaultBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    player.playAttack(plundersongGloombladeRed, { from });
    game.as(dash).defendWith();
    game.closeCombat({ entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-plundersong-gloomblade-red");
  },
};
