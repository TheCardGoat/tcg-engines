import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/levia.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { ravenousMeataxe as ravenousMeataxeRules } from "@tcg/flesh-and-blood-cards/cards/weapons/ravenous-meataxe";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const ravenousMeataxe = previewCard(ravenousMeataxeRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-levia",
  label: "Levia",
  description:
    "signature weapon: Ravenous Meataxe (LEV003) activates and opens combat at 3 power. If a card with 6 or more {p} has been put into your banished zone this turn, you don't lose {h} from blood debt during the end phase.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "levia"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const opponentHero = dash;

    const engine = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.activate(ravenousMeataxe);
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-levia");
  },
};
