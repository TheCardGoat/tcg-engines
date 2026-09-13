import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/tribute-to-greater-power.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import {
  snatchRed as snatchRedRules,
  snatchYellow as snatchYellowRules,
} from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { tributeToGreaterPowerRed as tributeToGreaterPowerRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/tribute-to-greater-power";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchRed = previewCard(snatchRedRules);
const snatchYellow = previewCard(snatchYellowRules);
const tributeToGreaterPowerRed = previewCard(tributeToGreaterPowerRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-tribute-to-greater-power-red",
  label: "Tribute to Greater Power (red)",
  description:
    "happy: banishing the tribute overpowers the next attack, then Blood Debt bites. Instant - Banish this from your hand: Your next attack this turn gets overpower.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "tribute-to-greater-power-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [tributeToGreaterPowerRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    game.as(dash);
    Malice.activate(tributeToGreaterPowerRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-tribute-to-greater-power-red");
  },
};
