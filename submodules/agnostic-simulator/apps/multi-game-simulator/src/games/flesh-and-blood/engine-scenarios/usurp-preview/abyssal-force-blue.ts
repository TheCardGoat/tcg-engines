import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/abyssal-force.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchYellow as snatchYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { unboundByShadowRed as unboundByShadowRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/unbound-by-shadow";
import { abyssalForceBlue as abyssalForceBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/abyssal-force";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchYellow = previewCard(snatchYellowRules);
const unboundByShadowRed = previewCard(unboundByShadowRedRules);
const abyssalForceBlue = previewCard(abyssalForceBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-abyssal-force-blue",
  label: "Abyssal Force (blue)",
  description:
    "Playing this from banished overpowers the next Shadow attack. You may play this from your banished zone.\nYour next Shadow attack this turn gets overpower.\nGo again\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "abyssal-force-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        banished: [abyssalForceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(abyssalForceBlue, { from: "banished" });
    engine.untilIdle();
    Chane.playAttack(unboundByShadowRed);
    return matchFromEngine(engine, "usurp-preview-abyssal-force-blue");
  },
};
