import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/otherworldly-sins.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";

import { boundingDemigonBlue as boundingDemigonBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/bounding-demigon";

import { otherworldlySinsBlue as otherworldlySinsBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/otherworldly-sins";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);

const boundingDemigonBlue = previewCard(boundingDemigonBlueRules);

const otherworldlySinsBlue = previewCard(otherworldlySinsBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-otherworldly-sins-blue",
  label: "Otherworldly Sins (blue)",
  description:
    "happy: the Runeblade attack gets +2{p} and a Runechant token is created. Your next Runeblade or Shadow attack this turn gets +1{p}.\nCreate a Runechant token.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "otherworldly-sins-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [otherworldlySinsBlue, boundingDemigonBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.play(otherworldlySinsBlue);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-otherworldly-sins-blue");
  },
};
