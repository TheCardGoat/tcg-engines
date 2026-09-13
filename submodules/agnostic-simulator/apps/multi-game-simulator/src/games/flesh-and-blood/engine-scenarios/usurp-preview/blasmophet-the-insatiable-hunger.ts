import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/tokens/blasmophet-the-insatiable-hunger.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";

import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { blasmophetTheInsatiableHunger as blasmophetTheInsatiableHungerRules } from "@tcg/flesh-and-blood-cards/cards/tokens/blasmophet-the-insatiable-hunger";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);

const nimblismBlue = previewCard(nimblismBlueRules);
const blasmophetTheInsatiableHunger = previewCard(blasmophetTheInsatiableHungerRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-blasmophet-the-insatiable-hunger",
  label: "Blasmophet, the Insatiable Hunger",
  description:
    "happy: at each end phase this is destroyed if you have not banished a blood-debt card. Unique\nOnce per turn, you may play an action card with blood debt from your banished zone.\nAt the beginning of each end phase, you may banish a card from your hand. Then if you haven't banished a card with blood debt this turn, destroy this.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "blasmophet-the-insatiable-hunger"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetTheInsatiableHunger],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline" });
    return matchFromEngine(engine, "usurp-preview-blasmophet-the-insatiable-hunger");
  },
};
