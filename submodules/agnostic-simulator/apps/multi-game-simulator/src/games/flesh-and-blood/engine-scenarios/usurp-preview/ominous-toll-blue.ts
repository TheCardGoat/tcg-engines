import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/ominous-toll.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { ominousTollBlue as ominousTollBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/ominous-toll";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const restlessClericRed = previewCard(restlessClericRedRules);
const malice = previewCard(maliceRules);
const ominousTollBlue = previewCard(ominousTollBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-ominous-toll-blue",
  label: "Ominous Toll (blue)",
  description:
    "Printed ability and its legal choices. When this attacks, you may discard a zombie. If you do, create a Gate to i'Arathael token.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "ominous-toll-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = ominousTollBlue;
    const pay = true;

    const engine = FabTestEngine.start(
      { hero: malice, hand: [card, restlessClericRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(malice);
    player.play(card);
    game.advanceUntil({
      stopAt: "defend",
      optionals: pay ? "accept" : "decline",
      entityTargets: "maximum",
    });
    return matchFromEngine(engine, "usurp-preview-ominous-toll-blue");
  },
};
