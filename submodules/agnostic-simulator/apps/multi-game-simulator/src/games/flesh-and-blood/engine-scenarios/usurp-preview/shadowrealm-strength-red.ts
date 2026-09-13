import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-strength.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { shadowrealmStrengthRed as shadowrealmStrengthRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-strength";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);

const restlessMagisterRed = previewCard(restlessMagisterRedRules);
const shadowrealmStrengthRed = previewCard(shadowrealmStrengthRedRules);
const snatchRed = previewCard(snatchRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-strength-red",
  label: "Shadowrealm Strength (red)",
  description:
    "happy: moving a banished zombie arms the next attack with +3{p}. You may put a card from your banished zone into your graveyard. If it's a zombie, your next attack this turn gets +3{p}.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-strength-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmStrengthRed, snatchRed],
        banished: [restlessMagisterRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    game.as(dash);
    Malice.play(shadowrealmStrengthRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-strength-red");
  },
};
