import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/battle-prep.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { valiantThrustRed as valiantThrustRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/valiant-thrust";
import { battlePrepYellow as battlePrepYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/battle-prep";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);

const valiantThrustRed = previewCard(valiantThrustRedRules);
const battlePrepYellow = previewCard(battlePrepYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-battle-prep-yellow",
  label: "Battle Prep (yellow)",
  description:
    "happy: played from arsenal it arms +3 on the next attack. Opt 2\nIf this was played from arsenal, your next attack this turn gets +2{p}.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "battle-prep-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [battlePrepYellow],
        hand: [valiantThrustRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    game.as(dash);
    Bravo.play(battlePrepYellow, { from: "arsenal", optBottom: 2 });
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(valiantThrustRed, { optionals: "decline" });
    return matchFromEngine(engine, "usurp-preview-battle-prep-yellow");
  },
};
