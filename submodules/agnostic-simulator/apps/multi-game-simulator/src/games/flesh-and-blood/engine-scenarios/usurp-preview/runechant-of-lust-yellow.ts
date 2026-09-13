import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/instants/runechant-of-lust.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";

import { sinspeakerGloombladeRed as sinspeakerGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/sinspeaker-gloomblade";
import { runechantOfLustYellow as runechantOfLust } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-lust";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);

const sinspeakerGloombladeRed = previewCard(sinspeakerGloombladeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-runechant-of-lust-yellow",
  label: "Runechant of Lust (yellow)",
  description:
    "happy: usurping this creates a Runechant in addition to the destroy mint. This counts as a Runechant. When an attack usurps this, create a Runechant token.\nWhen this is destroyed, create a Runechant token.\nAt the beginning of your action phase or when you play an attack action card, destroy this.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "runechant-of-lust-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfLust],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    game.as(dash);
    Chane.play(sinspeakerGloombladeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-runechant-of-lust-yellow");
  },
};
