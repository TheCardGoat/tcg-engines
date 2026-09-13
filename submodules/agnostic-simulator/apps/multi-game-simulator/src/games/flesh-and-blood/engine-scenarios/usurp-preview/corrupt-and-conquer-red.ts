import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/corrupt-and-conquer.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";

import { corruptAndConquerRed as corruptAndConquerRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/corrupt-and-conquer";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);
const snatchRed = previewCard(snatchRedRules);

const corruptAndConquerRed = previewCard(corruptAndConquerRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-corrupt-and-conquer-red",
  label: "Corrupt and Conquer (red)",
  description:
    "happy: a hero hit banishes every card in their arsenal. If this was played from your banished zone, it gets \"Defense reaction cards can't be played this chain link.\nWhen this hits a hero, banish all cards in their arsenal.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "corrupt-and-conquer-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [corruptAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.playAttack(corruptAndConquerRed);
    return matchFromEngine(engine, "usurp-preview-corrupt-and-conquer-red");
  },
};
