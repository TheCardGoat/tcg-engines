import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/open-the-gate-to-i-arathael.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";

import { openTheGateToIArathaelRed as openTheGateToIArathaelRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/open-the-gate-to-i-arathael";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);

const openTheGateToIArathaelRed = previewCard(openTheGateToIArathaelRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-open-the-gate-to-i-arathael-red",
  label: "Open the Gate to i'Arathael (red)",
  description:
    "happy: when this hits, a Gate to i'Arathael is created under your control. When this hits or is banished from hand or deck, create a Gate to i'Arathael token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "open-the-gate-to-i-arathael-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [openTheGateToIArathaelRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    game.as(dash);
    Chane.playAttack(openTheGateToIArathaelRed);
    return matchFromEngine(engine, "usurp-preview-open-the-gate-to-i-arathael-red");
  },
};
