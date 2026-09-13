import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/feeding-frenzy.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { ebonFold as ebonFoldRules } from "@tcg/flesh-and-blood-cards/cards/equipment/ebon-fold";
import { skullCrackRed as skullCrackRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/skull-crack";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { feedingFrenzyRed as feedingFrenzyRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/feeding-frenzy";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const ebonFold = previewCard(ebonFoldRules);
const skullCrackRed = previewCard(skullCrackRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const feedingFrenzyRed = previewCard(feedingFrenzyRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-feeding-frenzy-red",
  label: "Feeding Frenzy (red)",
  description:
    "After a 6{p} banish this turn the attack has go again. When this attacks, banish the top card of your deck.\nIf you've banished a card with 6 or more {p} this turn, this gets go again.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "feeding-frenzy-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, feedingFrenzyRed],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = engine.as(levia);
    Levia.activate(ebonFold);
    engine.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    Levia.playAttack(feedingFrenzyRed);
    return matchFromEngine(engine, "usurp-preview-feeding-frenzy-red");
  },
};
