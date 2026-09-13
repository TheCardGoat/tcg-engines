import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-ripper.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { ghostlyVisitRed as ghostlyVisitRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/ghostly-visit";
import { shadowrealmRipperRed as shadowrealmRipperRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-ripper";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const ghostlyVisitRed = previewCard(ghostlyVisitRedRules);
const shadowrealmRipperRed = previewCard(shadowrealmRipperRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-ripper-red",
  label: "Shadowrealm Ripper (red)",
  description:
    "happy: banishing a Shadow card from hand gives this +2{p}. When this attacks, you may banish a card from your hand. If it's Shadow, this gets +2{p}.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-ripper-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmRipperRed, ghostlyVisitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.playAttack(shadowrealmRipperRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(ghostlyVisitRed);
    game.advanceUntil({ stopAt: "defend" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-ripper-red");
  },
};
