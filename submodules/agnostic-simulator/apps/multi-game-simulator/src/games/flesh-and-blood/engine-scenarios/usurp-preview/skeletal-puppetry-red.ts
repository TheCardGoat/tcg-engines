import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/skeletal-puppetry.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { gravyBones as gravyBonesRules } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { oystenHeartOfGoldYellow as oystenHeartOfGoldYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/oysten-heart-of-gold";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { skeletalPuppetryRed as skeletalPuppetryRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/skeletal-puppetry";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const gravyBones = previewCard(gravyBonesRules);
const oystenHeartOfGoldYellow = previewCard(oystenHeartOfGoldYellowRules);
const restlessClericRed = previewCard(restlessClericRedRules);
const skeletalPuppetryRed = previewCard(skeletalPuppetryRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-skeletal-puppetry-red",
  label: "Skeletal Puppetry (red)",
  description:
    "happy: discarding an ally pays the cost and the next ally attack gets +3{p} and go again. You may discard an ally rather than pay this card's {r} cost.\nYour next ally attack this turn gets +3{p} and go again.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "skeletal-puppetry-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [skeletalPuppetryRed, restlessClericRed],
        arena: [oystenHeartOfGoldYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Gravy = game.as(gravyBones);
    Gravy.play(skeletalPuppetryRed, { modeIds: ["pay"] });
    game.untilIdle({ entityTargets: "maximum" });
    Gravy.activateAttack(oystenHeartOfGoldYellow);
    return matchFromEngine(engine, "usurp-preview-skeletal-puppetry-red");
  },
};
