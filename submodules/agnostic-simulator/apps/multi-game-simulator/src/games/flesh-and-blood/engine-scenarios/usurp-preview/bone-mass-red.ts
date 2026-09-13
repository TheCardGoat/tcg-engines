import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/bone-mass.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { boneMassRed as boneMassRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/bone-mass";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const boneMassRed = previewCard(boneMassRedRules);
const restlessClericRed = previewCard(restlessClericRedRules);
const snatchRed = previewCard(snatchRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-bone-mass-red",
  label: "Bone Mass (red)",
  description:
    "happy: discarding a zombie gives the next attack +1{p}. When this attacks, you may discard a zombie. If you do, your next attack this turn gets +1{p}.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bone-mass-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [boneMassRed, restlessClericRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(malice);
    player.play(boneMassRed);
    game.advanceUntil({
      stopAt: "defend",
      optionals: "accept",
      entityTargets: "maximum",
    });
    game.closeCombat();
    player.playAttack(snatchRed);
    return matchFromEngine(engine, "usurp-preview-bone-mass-red");
  },
};
