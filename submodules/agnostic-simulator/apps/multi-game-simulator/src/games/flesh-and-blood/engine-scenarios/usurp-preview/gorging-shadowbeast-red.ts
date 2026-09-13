import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/gorging-shadowbeast.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { gorgingShadowbeastRed as gorgingShadowbeastRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/gorging-shadowbeast";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const gorgingShadowbeastRed = previewCard(gorgingShadowbeastRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-gorging-shadowbeast-red",
  label: "Gorging Shadowbeast (red)",
  description:
    "Attacking banishes the deck top while this is still in combat. When this attacks, banish the top card of your deck.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "gorging-shadowbeast-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        hand: [gorgingShadowbeastRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = engine.as(levia);
    Levia.playAttack(gorgingShadowbeastRed);
    return matchFromEngine(engine, "usurp-preview-gorging-shadowbeast-red");
  },
};
