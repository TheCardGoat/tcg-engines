import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/headstrong-stampede.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { wreckerRompRed as wreckerRompRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/wrecker-romp";
import { headstrongStampedeRed as headstrongStampedeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/headstrong-stampede";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);
const wreckerRompRed = previewCard(wreckerRompRedRules);
const headstrongStampedeRed = previewCard(headstrongStampedeRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-headstrong-stampede-red",
  label: "Headstrong Stampede (red)",
  description:
    "Revealing a 6+ base {p} card grants go again. When this attacks, reveal the top card of your deck. If the revealed card has 6 or more base {p}, this gets go again.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "headstrong-stampede-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [headstrongStampedeRed],
        deckTop: [wreckerRompRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Rhinar = engine.as(rhinar);
    Rhinar.attackWith(headstrongStampedeRed);
    engine.passBoth();
    return matchFromEngine(engine, "usurp-preview-headstrong-stampede-red");
  },
};
