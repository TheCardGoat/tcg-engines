import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/feasting-shadowbeast.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { ebonFold as ebonFoldRules } from "@tcg/flesh-and-blood-cards/cards/equipment/ebon-fold";
import { skullCrackRed as skullCrackRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/skull-crack";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { feastingShadowbeastRed as feastingShadowbeastRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/feasting-shadowbeast";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const ebonFold = previewCard(ebonFoldRules);
const skullCrackRed = previewCard(skullCrackRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const feastingShadowbeastRed = previewCard(feastingShadowbeastRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-feasting-shadowbeast-red",
  label: "Feasting Shadowbeast (red)",
  description:
    "After a 6{p} banish this turn the attack is 8{p}. When this attacks, banish the top card of your deck.\nIf you've banished a card with 6 or more {p} this turn, this gets +2{p}.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "feasting-shadowbeast-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, feastingShadowbeastRed],
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
    Levia.playAttack(feastingShadowbeastRed);
    return matchFromEngine(engine, "usurp-preview-feasting-shadowbeast-red");
  },
};
