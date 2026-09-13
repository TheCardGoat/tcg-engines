import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/hex-gauntlet.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { gravelingGrowlBlue as gravelingGrowlBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/graveling-growl";
import { hexGauntlet as hexGauntletRules } from "@tcg/flesh-and-blood-cards/cards/equipment/hex-gauntlet";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const rhinar = previewCard(rhinarRules);
const bravo = previewCard(bravoRules);
const gravelingGrowlBlue = previewCard(gravelingGrowlBlueRules);
const hexGauntlet = previewCard(hexGauntletRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-hex-gauntlet",
  label: "Hex Gauntlet",
  description:
    "happy: banishing the gauntlet turns the banished blood-debt card face-down. Instant - Banish this: Turn a card with blood debt in your banished zone face-down.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "hex-gauntlet"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        life: 20,
        arms: [hexGauntlet],
        banished: [gravelingGrowlBlue],
        hand: [],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    Rhinar.activate(hexGauntlet);
    game.untilIdle({ entityTargets: "minimum" });
    return matchFromEngine(engine, "usurp-preview-hex-gauntlet");
  },
};
