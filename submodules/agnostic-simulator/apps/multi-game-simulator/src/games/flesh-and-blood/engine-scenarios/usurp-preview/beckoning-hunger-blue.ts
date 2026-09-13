import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/beckoning-hunger.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";

import { beckoningHungerBlue as beckoningHungerBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/beckoning-hunger";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);

const levia = previewCard(leviaRules);
const nimblismBlue = previewCard(nimblismBlueRules);

const beckoningHungerBlue = previewCard(beckoningHungerBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-beckoning-hunger-blue",
  label: "Beckoning Hunger (blue)",
  description:
    "happy: attacking banishes the deck top, and a hit creates Blasmophet and deals 7. When this attacks, banish the top card of your deck.\nWhen this hits, create a Blasmophet, the Insatiable Hunger token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "beckoning-hunger-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [beckoningHungerBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    game.as(dash);
    Levia.playAttack(beckoningHungerBlue);
    return matchFromEngine(engine, "usurp-preview-beckoning-hunger-blue");
  },
};
