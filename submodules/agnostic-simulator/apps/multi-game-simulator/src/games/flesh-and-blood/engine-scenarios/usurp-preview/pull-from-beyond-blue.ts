import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/pull-from-beyond.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";

import { pullFromBeyondBlue as pullFromBeyondBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/pull-from-beyond";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const snatchRed = previewCard(snatchRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);

const pullFromBeyondBlue = previewCard(pullFromBeyondBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-pull-from-beyond-blue",
  label: "Pull from Beyond (blue)",
  description:
    "happy: Opt 2 restacks, then banishing the new red top creates a Gate. Opt 2\nBanish the top card of your deck. If it's blue, create a Gate to i'Arathael token. Go again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "pull-from-beyond-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [pullFromBeyondBlue],
        actionPoints: 1,
        // Last is seated top. Opt 2 + optBottom 2 buries both looked blues;
        // the remaining red becomes the new top and is banished.
        deck: [snatchRed, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.play(pullFromBeyondBlue);
    game.untilIdle({ optBottom: 2 });
    return matchFromEngine(engine, "usurp-preview-pull-from-beyond-blue");
  },
};
