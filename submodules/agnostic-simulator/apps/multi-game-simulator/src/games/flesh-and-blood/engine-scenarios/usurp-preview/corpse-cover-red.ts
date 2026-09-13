import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/blocks/corpse-cover.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { gravyBones as gravyBonesRules } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { corpseCoverRed as corpseCoverRedRules } from "@tcg/flesh-and-blood-cards/cards/blocks/corpse-cover";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const gravyBones = previewCard(gravyBonesRules);
const snatchRed = previewCard(snatchRedRules);
const restlessClericRed = previewCard(restlessClericRedRules);
const corpseCoverRed = previewCard(corpseCoverRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-corpse-cover-red",
  label: "Corpse Cover (red)",
  description:
    "happy: while defending, discarding an ally prevents the next 2 damage. Once per Turn Instant - Destroy an ally you control or discard an ally: Prevent the next 2 damage that would be dealt to you this turn. Activate this only while this card is defending.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "corpse-cover-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [corpseCoverRed, restlessClericRed],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);
    Dash.playAttack(snatchRed);
    Gravy.defendWith(corpseCoverRed);
    game.toReaction("defender");
    Gravy.activate(corpseCoverRed);
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-corpse-cover-red");
  },
};
