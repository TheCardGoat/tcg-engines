import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-steed.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { voxNecropolis as voxNecropolisRules } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { restlessSteedRed as restlessSteedRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-steed";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const voxNecropolis = previewCard(voxNecropolisRules);
const restlessSteedRed = previewCard(restlessSteedRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-steed-red",
  label: "Restless Steed (red)",
  description:
    "A hit grants go again, leaving an action point after combat. When this hits, the attack gets go again.\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-steed-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessSteedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Malice = engine.as(malice);
    Malice.activateAttack(restlessSteedRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-restless-steed-red");
  },
};
