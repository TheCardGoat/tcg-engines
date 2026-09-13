import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/peak-power.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchYellow as snatchYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { wreckerRompRed as wreckerRompRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/wrecker-romp";
import { peakPowerRed as peakPowerRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/peak-power";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchYellow = previewCard(snatchYellowRules);
const wreckerRompRed = previewCard(wreckerRompRedRules);
const peakPowerRed = previewCard(peakPowerRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-peak-power-red",
  label: "Peak Power (red)",
  description:
    "Revealing a 6+ base {p} card grants overpower on this attack at defend. When this attacks, reveal the top card of your deck. If the revealed card has 6 or more base {p}, this gets overpower.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "peak-power-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [peakPowerRed],
        deckTop: [wreckerRompRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = engine.as(rhinar);
    Rhinar.playAttack(peakPowerRed);
    return matchFromEngine(engine, "usurp-preview-peak-power-red");
  },
};
