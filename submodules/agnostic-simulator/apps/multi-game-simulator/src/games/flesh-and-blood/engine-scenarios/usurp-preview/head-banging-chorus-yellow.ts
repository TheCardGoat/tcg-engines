import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/instants/head-banging-chorus.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chokeslamBlue as chokeslamBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/chokeslam";

import { headBangingChorusYellow as headBangingChorusYellowRules } from "@tcg/flesh-and-blood-cards/cards/instants/head-banging-chorus";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);
const chokeslamBlue = previewCard(chokeslamBlueRules);

const headBangingChorusYellow = previewCard(headBangingChorusYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-head-banging-chorus-yellow",
  label: "Head Banging Chorus (yellow)",
  description:
    'happy: the Guardian attack hits with an empty hand and draws a card. Suspense\nThe first Guardian or Revered attack action card you play each turn gets "When this hits a hero, if you have no cards in hand, draw a card."',
  group: "usurp-preview",
  tags: ["IAR", "preview", "head-banging-chorus-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headBangingChorusYellow, chokeslamBlue],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    Bravo.play(headBangingChorusYellow);
    game.helpers.untilIdle();
    Bravo.playAttack(chokeslamBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-head-banging-chorus-yellow");
  },
};
