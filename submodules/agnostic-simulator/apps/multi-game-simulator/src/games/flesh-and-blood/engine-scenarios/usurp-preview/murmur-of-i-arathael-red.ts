import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/murmur-of-i-arathael.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { azalea as azaleaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/azalea";
import { zeroToSixtyBlue as zeroToSixtyBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/zero-to-sixty";
import { murmurOfIArathaelRed as murmurOfIArathaelRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/murmur-of-i-arathael";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const azalea = previewCard(azaleaRules);
const zeroToSixtyBlue = previewCard(zeroToSixtyBlueRules);
const murmurOfIArathaelRed = previewCard(murmurOfIArathaelRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-murmur-of-i-arathael-red",
  label: "Murmur of i'Arathael (red)",
  description:
    "Boosting then attacking with this grants go again. If a card has been put into your banished zone this turn, this gets go again.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "murmur-of-i-arathael-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyBlue, murmurOfIArathaelRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = engine.as(dash);
    Dash.playAttack(zeroToSixtyBlue, { boost: true });
    engine.closeCombat();
    Dash.playAttack(murmurOfIArathaelRed);
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-murmur-of-i-arathael-red");
  },
};
