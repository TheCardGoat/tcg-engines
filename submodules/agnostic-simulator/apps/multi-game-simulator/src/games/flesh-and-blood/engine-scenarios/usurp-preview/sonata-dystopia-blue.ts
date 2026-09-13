import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/sonata-dystopia.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { runechant as runechantRules } from "@tcg/flesh-and-blood-cards/cards/tokens/runechant";
import { sonataDystopiaBlue as sonataDystopiaBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/sonata-dystopia";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const runechant = previewCard(runechantRules);
const sonataDystopiaBlue = previewCard(sonataDystopiaBlueRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-sonata-dystopia-blue",
  label: "Sonata Dystopia (blue)",
  description:
    'Printed ability and its legal choices. As an additional cost to play this, destroy X Runechants you control.\nThe next attack action card you play this turn costs {x} less to play and gets +X{p}, overpower, and "When this hits, create X Runechant tokens." Go again',
  group: "usurp-preview",
  tags: ["IAR", "preview", "sonata-dystopia-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const x = 2;

    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [sonataDystopiaBlue, brutalAssaultBlue],
        arena: x === 2 ? [runechant, runechant] : [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    player.play(sonataDystopiaBlue, { xValue: x });
    game.untilIdle({ entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-sonata-dystopia-blue");
  },
};
