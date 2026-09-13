import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/forbidden-harvest.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { satiateBloodthirstRed as satiateBloodthirstRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/satiate-bloodthirst";
import { cleaveTheHeavensRed as cleaveTheHeavensRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/cleave-the-heavens";
import { forbiddenHarvestYellow as forbiddenHarvestYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/forbidden-harvest";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const viserai = previewCard(viseraiRules);
const dash = previewCard(dashRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const satiateBloodthirstRed = previewCard(satiateBloodthirstRedRules);
const cleaveTheHeavensRed = previewCard(cleaveTheHeavensRedRules);
const forbiddenHarvestYellow = previewCard(forbiddenHarvestYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-forbidden-harvest-yellow",
  label: "Forbidden Harvest (yellow)",
  description:
    "happy: turning two Shadow cards and one generic face-down creates 2 Runechants. Turn up to 3 cards in your banished zone face-down, then create a Runechant token for each Shadow card turned face-down this way.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "forbidden-harvest-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [forbiddenHarvestYellow],
        banished: [
          { card: satiateBloodthirstRed, state: { faceDown: false } },
          { card: cleaveTheHeavensRed, state: { faceDown: false } },
          { card: nimblismBlue, state: { faceDown: false } },
        ],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viserai);
    Viserai.play(forbiddenHarvestYellow);
    game.untilIdle({ entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-forbidden-harvest-yellow");
  },
};
