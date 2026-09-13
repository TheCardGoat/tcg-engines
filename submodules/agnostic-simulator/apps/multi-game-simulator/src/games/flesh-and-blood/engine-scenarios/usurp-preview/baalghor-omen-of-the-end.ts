import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/baalghor-omen-of-the-end.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { baalghorOmenOfTheEnd as baalghorOmenOfTheEndRules } from "@tcg/flesh-and-blood-cards/cards/heroes/baalghor-omen-of-the-end";

import { wallopRed as wallopRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/wallop";

import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const baalghorOmenOfTheEnd = previewCard(baalghorOmenOfTheEndRules);

const wallopRed = previewCard(wallopRedRules);

const snatchRed = previewCard(snatchRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-baalghor-omen-of-the-end",
  label: "Baalghor, Omen of the End",
  description:
    "core mechanic: pitched cards go to banished zone instead of pitch zone. Whenever you pitch a card, banish it.\nAttack action cards played from your banished zone get +3{p}.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "baalghor-omen-of-the-end"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const opponentHero = dash;

    const engine = FabTestEngine.start(
      {
        hero: baalghorOmenOfTheEnd,
        hand: [wallopRed, snatchRed],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Baalghor = game.as(baalghorOmenOfTheEnd);
    Baalghor.play(wallopRed, { pitch: [snatchRed] });
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-baalghor-omen-of-the-end");
  },
};
