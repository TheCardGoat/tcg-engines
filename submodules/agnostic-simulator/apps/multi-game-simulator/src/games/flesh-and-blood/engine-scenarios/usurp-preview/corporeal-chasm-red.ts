import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/corporeal-chasm.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { corporealChasmRed as corporealChasmRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/corporeal-chasm";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const corporealChasmRed = previewCard(corporealChasmRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-corporeal-chasm-red",
  label: "Corporeal Chasm (red)",
  description:
    "A hit creates a Gate to i'Arathael. When this hits, create a Gate to i'Arathael token.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "corporeal-chasm-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [corporealChasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.playAttack(corporealChasmRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-corporeal-chasm-red");
  },
};
