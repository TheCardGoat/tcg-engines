import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/blasmophet-s-boon.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { levia as leviaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/levia";
import { blasmophetTheInsatiableHunger as blasmophetTheInsatiableHungerRules } from "@tcg/flesh-and-blood-cards/cards/tokens/blasmophet-the-insatiable-hunger";
import { blasmophetSBoonBlue as blasmophetSBoonBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/blasmophet-s-boon";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const levia = previewCard(leviaRules);
const blasmophetTheInsatiableHunger = previewCard(blasmophetTheInsatiableHungerRules);
const blasmophetSBoonBlue = previewCard(blasmophetSBoonBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-blasmophet-s-boon-blue",
  label: "Blasmophet's Boon (blue)",
  description:
    "Controlling a Blasmophet makes this a 6{p} attack. If you control a Blasmophet, this card's {p} is 6. Otherwise, it's 0.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "blasmophet-s-boon-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [blasmophetSBoonBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Levia = engine.as(levia);
    Levia.playAttack(blasmophetSBoonBlue);
    return matchFromEngine(engine, "usurp-preview-blasmophet-s-boon-blue");
  },
};
