import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/battle-clearing-bellow.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { apexBusterYellow as apexBusterYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/apex-buster";
import { battleClearingBellowBlue as battleClearingBellowBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/battle-clearing-bellow";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);
const apexBusterYellow = previewCard(apexBusterYellowRules);
const battleClearingBellowBlue = previewCard(battleClearingBellowBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-battle-clearing-bellow-blue",
  label: "Battle Clearing Bellow (blue)",
  description:
    "happy: the next attack with 6 or more base {p} gets +6 power. Your next attack with 6 or more base {p} this turn gets +6{p}.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "battle-clearing-bellow-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battleClearingBellowBlue, apexBusterYellow],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    Bravo.play(battleClearingBellowBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(apexBusterYellow, { optionals: "decline" });
    return matchFromEngine(engine, "usurp-preview-battle-clearing-bellow-blue");
  },
};
