import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/blocks/dam-the-shadowake.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { damTheShadowakeRed as damTheShadowakeRedRules } from "@tcg/flesh-and-blood-cards/cards/blocks/dam-the-shadowake";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const snatchRed = previewCard(snatchRedRules);
const damTheShadowakeRed = previewCard(damTheShadowakeRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-dam-the-shadowake-red",
  label: "Dam the Shadowake (red)",
  description:
    "happy: defending a Shadow hero's attack creates a Gate to i'Arathael. When this defends a Shadow hero's attack, create a Gate to i'Arathael token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "dam-the-shadowake-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [damTheShadowakeRed],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    const Dash = game.as(dash);
    Chane.playAttack(snatchRed);
    Dash.defendWith(damTheShadowakeRed);
    game.toReaction();
    return matchFromEngine(engine, "usurp-preview-dam-the-shadowake-red");
  },
};
