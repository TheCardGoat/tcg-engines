import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-magister.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { voxNecropolis as voxNecropolisRules } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const snatchRed = previewCard(snatchRedRules);
const voxNecropolis = previewCard(voxNecropolisRules);
const malice = previewCard(maliceRules);
const restlessMagisterRed = previewCard(restlessMagisterRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-magister-red",
  label: "Restless Magister (red)",
  description:
    "happy: hitting a hero under Vox banishes a card from their hand. When this hits a hero, they banish a card from their hand.\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-magister-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    Malice.activate(restlessMagisterRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    return matchFromEngine(engine, "usurp-preview-restless-magister-red");
  },
};
