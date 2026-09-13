import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-quartermaster.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessQuartermasterRed as restlessQuartermasterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-quartermaster";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { voxNecropolis as voxNecropolisRules } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const malice = previewCard(maliceRules);
const dash = previewCard(dashRules);
const restlessQuartermasterRed = previewCard(restlessQuartermasterRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const voxNecropolis = previewCard(voxNecropolisRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-quartermaster-red",
  label: "Restless Quartermaster (red)",
  description:
    "happy: hitting a hero banishes the card in their arsenal. When this hits a hero, they banish a card in their arsenal.\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-quartermaster-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessQuartermasterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    Malice.activate(restlessQuartermasterRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    return matchFromEngine(engine, "usurp-preview-restless-quartermaster-red");
  },
};
