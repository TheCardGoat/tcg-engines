import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/boneseer-skullcap.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { wreckerRompRed as wreckerRompRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/wrecker-romp";
import { boneseerSkullcap as boneseerSkullcapRules } from "@tcg/flesh-and-blood-cards/cards/equipment/boneseer-skullcap";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);
const snatchRed = previewCard(snatchRedRules);
const wreckerRompRed = previewCard(wreckerRompRedRules);
const boneseerSkullcap = previewCard(boneseerSkullcapRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-boneseer-skullcap",
  label: "Boneseer Skullcap",
  description:
    "Defending keeps a 6+ base {p} reveal on top of the deck. When this defends, reveal the top card of your deck. If it has 6 or more base {p}, put it on top. Otherwise, put it on the bottom. Temper",
  group: "usurp-preview",
  tags: ["IAR", "preview", "boneseer-skullcap"],
  viewerId: "player-2",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        head: [boneseerSkullcap],
        deckTop: [wreckerRompRed],
        deck: 6,
        life: 40,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    engine.as(dash).attackWith(snatchRed);
    engine.advanceCombatTo("defend");
    engine.as(rhinar).defendWith(boneseerSkullcap);
    engine.passBoth();
    return matchFromEngine(engine, "usurp-preview-boneseer-skullcap");
  },
};
