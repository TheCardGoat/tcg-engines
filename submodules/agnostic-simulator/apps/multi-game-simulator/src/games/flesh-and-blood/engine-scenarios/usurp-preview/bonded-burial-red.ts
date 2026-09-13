import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/bonded-burial.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { bondedBurialRed as bondedBurialRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/bonded-burial";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const bondedBurialRed = previewCard(bondedBurialRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const restlessClericRed = previewCard(restlessClericRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-bonded-burial-red",
  label: "Bonded Burial (red)",
  description:
    "happy: discarding an ally after hitting a hero makes them discard. When this hits a hero, you may destroy an ally you control or discard an ally. If you do, they discard a card.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bonded-burial-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [bondedBurialRed, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    Malice.playAttack(bondedBurialRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-bonded-burial-red");
  },
};
