import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/rumbling-hunger.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { ebonFold as ebonFoldRules } from "@tcg/flesh-and-blood-cards/cards/equipment/ebon-fold";
import { skullCrackRed as skullCrackRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/skull-crack";
import { rumblingHungerRed as rumblingHungerRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/rumbling-hunger";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const ebonFold = previewCard(ebonFoldRules);
const skullCrackRed = previewCard(skullCrackRedRules);
const rumblingHungerRed = previewCard(rumblingHungerRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-rumbling-hunger-red",
  label: "Rumbling Hunger (red)",
  description:
    "A hit after a 6{p} banish creates Blasmophet and go again. When this hits, if you've banished a card with 6 or more {p} this turn, create a Blasmophet, the Insatiable Hunger token and this gets go again.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rumbling-hunger-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, rumblingHungerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = engine.as(levia);
    const Dash = engine.as(dash);
    Levia.activate(ebonFold);
    engine.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    Levia.playAttack(rumblingHungerRed);
    Dash.defendWith();
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-rumbling-hunger-red");
  },
};
