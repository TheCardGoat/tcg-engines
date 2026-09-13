import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/breach-flesh.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { breachFleshRed as breachFleshRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/breach-flesh";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const breachFleshRed = previewCard(breachFleshRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-breach-flesh-red",
  label: "Breach Flesh (red)",
  description:
    "A hit creates a Gate to i'Arathael. When this hits, create a Gate to i'Arathael token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "breach-flesh-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [breachFleshRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.playAttack(breachFleshRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-breach-flesh-red");
  },
};
