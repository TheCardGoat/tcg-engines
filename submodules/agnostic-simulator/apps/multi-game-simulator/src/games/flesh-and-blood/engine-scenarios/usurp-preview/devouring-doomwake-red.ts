import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/devouring-doomwake.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { devouringDoomwakeRed as devouringDoomwakeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/devouring-doomwake";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const devouringDoomwakeRed = previewCard(devouringDoomwakeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-devouring-doomwake-red",
  label: "Devouring Doomwake (red)",
  description:
    "An unblocked hit banishes this instead of the graveyard. When this hits, banish it and all defending cards.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "devouring-doomwake-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [devouringDoomwakeRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = engine.as(levia);
    const Dash = engine.as(dash);
    Levia.playAttack(devouringDoomwakeRed);
    Dash.defendWith();
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-devouring-doomwake-red");
  },
};
