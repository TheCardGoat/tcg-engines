import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/weapons/hell-hammer.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";

import { hellHammer as hellHammerRules } from "@tcg/flesh-and-blood-cards/cards/weapons/hell-hammer";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);

const hellHammer = previewCard(hellHammerRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-hell-hammer",
  label: "Hell Hammer",
  description:
    "happy: attacking with the hammer banishes it when the combat chain closes. Once per Turn Action - {r}{r}: Attack\nWhen the combat chain closes, if you've attacked with this, banish it.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "hell-hammer"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hellHammer],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    Rhinar.activateAttack(hellHammer);
    return matchFromEngine(engine, "usurp-preview-hell-hammer");
  },
};
