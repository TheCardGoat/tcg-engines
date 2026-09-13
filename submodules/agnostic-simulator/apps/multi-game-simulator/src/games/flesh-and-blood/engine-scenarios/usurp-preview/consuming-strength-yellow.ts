import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/consuming-strength.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { consumingStrengthYellow as consumingStrengthYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/consuming-strength";
import { blasmophetTheInsatiableHunger as blasmophetTheInsatiableHungerRules } from "@tcg/flesh-and-blood-cards/cards/tokens/blasmophet-the-insatiable-hunger";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const levia = previewCard(leviaRules);
const dash = previewCard(dashRules);

const consumingStrengthYellow = previewCard(consumingStrengthYellowRules);
const blasmophetTheInsatiableHunger = previewCard(blasmophetTheInsatiableHungerRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-consuming-strength-yellow",
  label: "Consuming Strength (yellow)",
  description:
    "happy: controlling a Blasmophet ally lets you play the attack. Play this only if you control a Blasmophet.\nInstant - {r}, banish this from your hand: Your next attack this turn gets +2{p}.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "consuming-strength-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingStrengthYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Levia = game.as(levia);
    Levia.playAttack(consumingStrengthYellow, { optionals: "decline" });
    return matchFromEngine(engine, "usurp-preview-consuming-strength-yellow");
  },
};
