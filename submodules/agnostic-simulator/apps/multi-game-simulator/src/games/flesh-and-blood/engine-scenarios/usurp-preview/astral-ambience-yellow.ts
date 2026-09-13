import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/astral-ambience.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { astralAmbienceYellow as astralAmbienceYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/astral-ambience";
import { prism as prismRules } from "@tcg/flesh-and-blood-cards/cards/heroes/prism";

import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const astralAmbienceYellow = previewCard(astralAmbienceYellowRules);
const prism = previewCard(prismRules);

const nimblismBlue = previewCard(nimblismBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-astral-ambience-yellow",
  label: "Astral Ambience (yellow)",
  description:
    "fragmenting against a defending card creates a Spectral Shield. Whenever this fragments, create a Spectral Shield token.\nInstant - {t} a Spectral Shield you control: This gets go again.\nFragment",
  group: "usurp-preview",
  tags: ["IAR", "preview", "astral-ambience-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: prism, hand: [astralAmbienceYellow], resourcePoints: 4, deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    game.as(prism).playAttack(astralAmbienceYellow);
    game.as(dash).defendWith(nimblismBlue);
    game.toReaction();
    return matchFromEngine(engine, "usurp-preview-astral-ambience-yellow");
  },
};
