import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/ancient-earth-oak.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { terra as terraRules } from "@tcg/flesh-and-blood-cards/cards/heroes/terra";
import { ancientEarthOakRed as ancientEarthOakRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/ancient-earth-oak";

import { weaveEarthRed as weaveEarthRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/weave-earth";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const terra = previewCard(terraRules);
const ancientEarthOakRed = previewCard(ancientEarthOakRedRules);

const weaveEarthRed = previewCard(weaveEarthRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-ancient-earth-oak-red",
  label: "Ancient Earth Oak (red)",
  description:
    'happy: Earth Bond grants +2 and a hit creates Frostbite and returns the oak. When this hits a hero, create a Frostbite token under their control.\nEarth Bond - If an Earth card was pitched to play this, this gets +2{p} and "When this hits a hero, put this on the bottom of its owner\'s deck."',
  group: "usurp-preview",
  tags: ["IAR", "preview", "ancient-earth-oak-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: terra,
        hand: [ancientEarthOakRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Terra = game.as(terra);
    game.as(dash);
    Terra.must.pitch(weaveEarthRed).playAttack(ancientEarthOakRed);
    game.advanceUntil({ stopAt: "defend" });
    return matchFromEngine(engine, "usurp-preview-ancient-earth-oak-red");
  },
};
