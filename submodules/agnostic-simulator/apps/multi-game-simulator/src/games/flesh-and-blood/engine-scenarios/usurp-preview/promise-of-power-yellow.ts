import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/promise-of-power.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { bloodfrenzyGloombladeRed as bloodfrenzyGloombladeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/bloodfrenzy-gloomblade";
import { promiseOfPowerYellow as promiseOfPowerYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/promise-of-power";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const bloodfrenzyGloombladeRed = previewCard(bloodfrenzyGloombladeRedRules);
const promiseOfPowerYellow = previewCard(promiseOfPowerYellowRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-promise-of-power-yellow",
  label: "Promise of Power (yellow)",
  description:
    "The next attack action played from banished creates 2 Runechants. The next time you play an attack action card from your banished zone this turn, create 2 Runechant tokens.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "promise-of-power-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [promiseOfPowerYellow],
        banished: [bloodfrenzyGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(promiseOfPowerYellow);
    engine.untilIdle();
    Chane.playAttack(bloodfrenzyGloombladeRed, { from: "banished" });
    return matchFromEngine(engine, "usurp-preview-promise-of-power-yellow");
  },
};
