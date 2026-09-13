import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/whispers-within.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { azalea as azaleaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/azalea";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { whispersWithinRed as whispersWithinRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/whispers-within";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const azalea = previewCard(azaleaRules);
const dash = previewCard(dashRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchRed = previewCard(snatchRedRules);
const whispersWithinRed = previewCard(whispersWithinRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-whispers-within-red",
  label: "Whispers Within (red)",
  description: "happy: defending with this opts 1. When this defends, opt 1.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "whispers-within-red"],
  viewerId: "player-2",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [whispersWithinRed],
        deckTop: [nimblismBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);
    Dash.playAttack(snatchRed);
    Azalea.defendWith(whispersWithinRed);
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-whispers-within-red");
  },
};
