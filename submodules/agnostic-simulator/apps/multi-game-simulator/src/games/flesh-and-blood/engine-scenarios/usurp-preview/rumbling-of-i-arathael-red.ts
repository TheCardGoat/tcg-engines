import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/rumbling-of-i-arathael.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { azalea as azaleaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/azalea";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchYellow as snatchYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { zeroToSixtyBlue as zeroToSixtyBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/zero-to-sixty";
import { rumblingOfIArathaelRed as rumblingOfIArathaelRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/rumbling-of-i-arathael";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const azalea = previewCard(azaleaRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchYellow = previewCard(snatchYellowRules);
const zeroToSixtyBlue = previewCard(zeroToSixtyBlueRules);
const rumblingOfIArathaelRed = previewCard(rumblingOfIArathaelRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-rumbling-of-i-arathael-red",
  label: "Rumbling of i'Arathael (red)",
  description:
    "A card put into the banished zone this turn grants overpower at defend. If a card has been put into your banished zone this turn, this gets overpower.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rumbling-of-i-arathael-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyBlue, rumblingOfIArathaelRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = engine.as(dash);
    Dash.playAttack(zeroToSixtyBlue, { boost: true });
    engine.closeCombat();
    Dash.playAttack(rumblingOfIArathaelRed);
    return matchFromEngine(engine, "usurp-preview-rumbling-of-i-arathael-red");
  },
};
