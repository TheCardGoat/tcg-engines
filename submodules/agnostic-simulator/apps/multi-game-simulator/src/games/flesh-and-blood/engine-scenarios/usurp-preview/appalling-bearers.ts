import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/appalling-bearers.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { restlessCommanderRed as restlessCommanderRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-commander";
import { appallingBearers as appallingBearersRules } from "@tcg/flesh-and-blood-cards/cards/equipment/appalling-bearers";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const snatchRed = previewCard(snatchRedRules);
const restlessCommanderRed = previewCard(restlessCommanderRedRules);
const appallingBearers = previewCard(appallingBearersRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-appalling-bearers",
  label: "Appalling Bearers",
  description:
    "happy: discarding a zombie and destroying this prevents the next 2 damage. Instant - Discard a zombie, destroy this: Prevent the next 2 damage that would be dealt to you this turn.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "appalling-bearers"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arms: [appallingBearers],
        hand: [restlessCommanderRed],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    const Malice = game.as(malice);
    Dash.playAttack(snatchRed);
    Malice.defendWith();
    game.toReaction("defender");
    Malice.activate(appallingBearers);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    return matchFromEngine(engine, "usurp-preview-appalling-bearers");
  },
};
