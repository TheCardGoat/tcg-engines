import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/goremass-summoning.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { ebonFold as ebonFoldRules } from "@tcg/flesh-and-blood-cards/cards/equipment/ebon-fold";
import { skullCrackRed as skullCrackRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/skull-crack";
import { goremassSummoningBlue as goremassSummoningBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/goremass-summoning";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const ebonFold = previewCard(ebonFoldRules);
const skullCrackRed = previewCard(skullCrackRedRules);
const goremassSummoningBlue = previewCard(goremassSummoningBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-goremass-summoning-blue",
  label: "Goremass Summoning (blue)",
  description:
    "After a 6{p} banish this turn it creates Blasmophet and refunds the action point. If you've banished a card with 6 or more {p} this turn, create a Blasmophet, the Insatiable Hunger token.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "goremass-summoning-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, goremassSummoningBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = engine.as(levia);
    Levia.activate(ebonFold);
    engine.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    Levia.play(goremassSummoningBlue);
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-goremass-summoning-blue");
  },
};
