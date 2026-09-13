import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/shadowrealm-bloodhound.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { ghostlyVisitRed as ghostlyVisitRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/ghostly-visit";
import { shadowrealmBloodhoundRed as shadowrealmBloodhoundRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/shadowrealm-bloodhound";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const ghostlyVisitRed = previewCard(ghostlyVisitRedRules);
const shadowrealmBloodhoundRed = previewCard(shadowrealmBloodhoundRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-shadowrealm-bloodhound-red",
  label: "Shadowrealm Bloodhound (red)",
  description:
    "happy: banishing a Shadow card from hand grants go again. When this attacks, you may banish a card from your hand. If it's Shadow, this gets go again.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "shadowrealm-bloodhound-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmBloodhoundRed, ghostlyVisitRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.playAttack(shadowrealmBloodhoundRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(ghostlyVisitRed);
    game.advanceUntil({ stopAt: "defend" });
    return matchFromEngine(engine, "usurp-preview-shadowrealm-bloodhound-red");
  },
};
