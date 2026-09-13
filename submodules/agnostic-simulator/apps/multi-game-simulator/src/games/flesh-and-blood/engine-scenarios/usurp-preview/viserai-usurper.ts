import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/viserai-usurper.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viseraiUsurper as viseraiUsurperRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai-usurper";

import { boundingDemigonRed as boundingDemigonRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/bounding-demigon";
import { tomeOfFyendalYellow as tomeOfFyendalYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/tome-of-fyendal";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viseraiUsurper = previewCard(viseraiUsurperRules);

const boundingDemigonRed = previewCard(boundingDemigonRedRules);
const tomeOfFyendalYellow = previewCard(tomeOfFyendalYellowRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-viserai-usurper",
  label: "Viserai, Usurper",
  description:
    "boundary: a blood-debt attack played (conditions met) resolves as the attack. The first attack action card with blood debt you play each turn gets go again.\nAt the beginning of each end phase, if you've created or activated a Gate to i'Arathael this turn, you may traverse.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "viserai-usurper"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const opponentHero = dash;

    const engine = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        hand: [tomeOfFyendalYellow, boundingDemigonRed],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viseraiUsurper);
    Viserai.must.play(tomeOfFyendalYellow);
    game.untilIdle();
    Viserai.playAttack(boundingDemigonRed);
    game.closeCombat({ optionals: "decline" });
    return matchFromEngine(engine, "usurp-preview-viserai-usurper");
  },
};
