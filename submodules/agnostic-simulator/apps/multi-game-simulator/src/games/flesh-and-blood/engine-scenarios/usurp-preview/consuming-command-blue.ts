import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/consuming-command.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { blasmophetTheInsatiableHunger as blasmophetTheInsatiableHungerRules } from "@tcg/flesh-and-blood-cards/cards/tokens/blasmophet-the-insatiable-hunger";
import { consumingCommandBlue as consumingCommandBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/consuming-command";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);
const blasmophetTheInsatiableHunger = previewCard(blasmophetTheInsatiableHungerRules);
const consumingCommandBlue = previewCard(consumingCommandBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-consuming-command-blue",
  label: "Consuming Command (blue)",
  description:
    'happy: resolving this grants a Blasmophet token Attack and go again. Until end of turn, Blasmophet, the Insatiable Hunger tokens you control get "Action - {t}: Attack. Go again"\nGo again\nBlood Debt',
  group: "usurp-preview",
  tags: ["IAR", "preview", "consuming-command-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingCommandBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.play(consumingCommandBlue);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-consuming-command-blue");
  },
};
