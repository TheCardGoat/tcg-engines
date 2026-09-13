import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/sigil-of-the-muse.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { kano as kanoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/kano";

import { tomeOfFyendalYellow as tomeOfFyendalYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/tome-of-fyendal";
import { sigilOfTheMuseRed as sigilOfTheMuseRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/sigil-of-the-muse";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const kano = previewCard(kanoRules);

const tomeOfFyendalYellow = previewCard(tomeOfFyendalYellowRules);
const sigilOfTheMuseRed = previewCard(sigilOfTheMuseRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-sigil-of-the-muse-red",
  label: "Sigil of the Muse (red)",
  description:
    "Printed ability and its legal choices. If a hero would draw 1 or more cards during an action phase, instead they create that many Ponder tokens.\nAt the beginning of your action phase, destroy this and create a Ponder token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "sigil-of-the-muse-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const own = true;

    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow],
        arena: own ? [sigilOfTheMuseRed] : [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], arena: own ? [] : [sigilOfTheMuseRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const drawer = game.as(dash);
    drawer.play(tomeOfFyendalYellow);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-sigil-of-the-muse-red");
  },
};
