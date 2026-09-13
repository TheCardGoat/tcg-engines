import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/rocktop-bellow.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { wreckerRompRed as wreckerRompRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/wrecker-romp";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { rocktopBellowRed as rocktopBellowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/rocktop-bellow";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const wreckerRompRed = previewCard(wreckerRompRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchRed = previewCard(snatchRedRules);
const rocktopBellowRed = previewCard(rocktopBellowRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-rocktop-bellow-red",
  label: "Rocktop Bellow (red)",
  description:
    "Revealing 6+ base {p} gives the next attack overpower and +4{p}. Reveal the top card of your deck. If the revealed card has 6 or more base {p}, your next attack this turn gets overpower. Otherwise, put the revealed card on the bottom.\nYour next attack this turn gets +4{p}. Go again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rocktop-bellow-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rocktopBellowRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deckTop: [wreckerRompRed],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = engine.as(rhinar);
    Rhinar.play(rocktopBellowRed);
    engine.untilIdle();
    Rhinar.playAttack(brutalAssaultBlue);
    return matchFromEngine(engine, "usurp-preview-rocktop-bellow-red");
  },
};
