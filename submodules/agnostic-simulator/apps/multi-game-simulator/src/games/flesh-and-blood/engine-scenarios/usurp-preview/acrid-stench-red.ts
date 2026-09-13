import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/acrid-stench.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { acridStenchRed as acridStenchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/acrid-stench";
import { corruptedCorpse as corruptedCorpseRules } from "@tcg/flesh-and-blood-cards/cards/actions/corrupted-corpse";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const acridStenchRed = previewCard(acridStenchRedRules);
const corruptedCorpse = previewCard(corruptedCorpseRules);
const restlessClericRed = previewCard(restlessClericRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-acrid-stench-red",
  label: "Acrid Stench (red)",
  description:
    "happy: discarding a zombie creates a Corrupted Corpse in banished. When this attacks, you may discard a zombie. If you do, create a Corrupted Corpse in your banished zone.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "acrid-stench-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: malice, hand: [acridStenchRed, restlessClericRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(malice);
    player.play(acridStenchRed);
    game.advanceUntil({
      stopAt: "defend",
      optionals: "accept",
      entityTargets: "maximum",
    });
    game.as(malice).cardIn("banished", corruptedCorpse);
    return matchFromEngine(engine, "usurp-preview-acrid-stench-red");
  },
};
