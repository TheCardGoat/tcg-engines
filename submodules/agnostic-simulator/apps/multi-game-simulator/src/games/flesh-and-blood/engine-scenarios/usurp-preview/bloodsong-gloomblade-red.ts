import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/bloodsong-gloomblade.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { bloodsongGloombladeRed as bloodsongGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/bloodsong-gloomblade";
import { sigilOfEarthBlue as sigilOfEarthBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/sigil-of-earth";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const bloodsongGloombladeRed = previewCard(bloodsongGloombladeRedRules);
const sigilOfEarthBlue = previewCard(sigilOfEarthBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-bloodsong-gloomblade-red",
  label: "Bloodsong Gloomblade (red)",
  description:
    "happy: played from the banished zone, a hit banishes the defender's aura. You may play this from your banished zone.\nUsurp\nWhen this hits a hero, you may banish target aura permanent they control.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bloodsong-gloomblade-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [sigilOfEarthBlue],
        life: 20,
        deck: 6,
      },
      {
        hero: viserai,
        banished: [bloodsongGloombladeRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);
    Dash.play(sigilOfEarthBlue);
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();
    Viserai.playAttack(bloodsongGloombladeRed, { from: "banished" });
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-bloodsong-gloomblade-red");
  },
};
