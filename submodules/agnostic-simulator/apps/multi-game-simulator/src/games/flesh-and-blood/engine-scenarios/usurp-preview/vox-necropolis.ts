import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/weapons/vox-necropolis.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { voxNecropolis as voxNecropolisRules } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const restlessMagisterRed = previewCard(restlessMagisterRedRules);
const malice = previewCard(maliceRules);
const voxNecropolis = previewCard(voxNecropolisRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-vox-necropolis",
  label: "Vox Necropolis",
  description:
    'happy: grants a zombie Attack that opens combat. During your action phase, zombies you\'ve played from a graveyard or banished zone enter the arena tapped and get "When this enters the arena, attack with it."\nZombies you control get "Action - {r}, {t}: Attack"',
  group: "usurp-preview",
  tags: ["IAR", "preview", "vox-necropolis"],
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
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    Malice.activate(restlessMagisterRed);
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-vox-necropolis");
  },
};
