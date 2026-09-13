import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/rally-the-shadow-horde.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { rallyTheShadowHordeRed as rallyTheShadowHordeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/rally-the-shadow-horde";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const snatchRed = previewCard(snatchRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const rallyTheShadowHordeRed = previewCard(rallyTheShadowHordeRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-rally-the-shadow-horde-red",
  label: "Rally the Shadow Horde (red)",
  description:
    "happy: while defending, banishing a card from hand gives this +2 defense. Once per Turn Instant - Banish a card from your hand: This gets +2{d}. Activate this only while this card is defending.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rally-the-shadow-horde-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: chane,
        hand: [rallyTheShadowHordeRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    game.as(dash).playAttack(snatchRed);
    Chane.defendWith(rallyTheShadowHordeRed);
    game.helpers.passPriorityTo(Chane);
    Chane.activate(rallyTheShadowHordeRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-rally-the-shadow-horde-red");
  },
};
