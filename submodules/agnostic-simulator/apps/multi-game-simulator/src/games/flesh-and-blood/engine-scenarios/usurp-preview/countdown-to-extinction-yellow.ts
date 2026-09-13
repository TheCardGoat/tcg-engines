import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/countdown-to-extinction.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";

import { darkestHourRed as darkestHourRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/darkest-hour";
import { countdownToExtinctionYellow as countdownToExtinctionYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/countdown-to-extinction";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const darkestHourRed = previewCard(darkestHourRedRules);
const countdownToExtinctionYellow = previewCard(countdownToExtinctionYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-countdown-to-extinction-yellow",
  label: "Countdown to Extinction (yellow)",
  description:
    "Printed ability and its legal choices. When this attacks, create a Gate to i'Arathael token.\nWhen this hits, you may search your deck for a Darkest Hour, banish it, then shuffle.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "countdown-to-extinction-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = countdownToExtinctionYellow;

    const engine = FabTestEngine.start(
      { hero: chane, hand: [card], deck: [darkestHourRed, brutalAssaultBlue], resourcePoints: 5 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    player.cardIn("deck", darkestHourRed);
    player.playAttack(card);
    return matchFromEngine(engine, "usurp-preview-countdown-to-extinction-yellow");
  },
};
