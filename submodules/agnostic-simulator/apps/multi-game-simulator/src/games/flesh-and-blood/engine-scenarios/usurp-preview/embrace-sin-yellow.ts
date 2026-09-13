import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/embrace-sin.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { woundingBlowBlue as woundingBlowBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/wounding-blow";
import { runechantOfGreedYellow as runechantOfGreedYellowRules } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-greed";

import { poundOfFleshBlue as poundOfFleshBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/pound-of-flesh";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { embraceSinYellow as embraceSinYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/embrace-sin";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const woundingBlowBlue = previewCard(woundingBlowBlueRules);
const runechantOfGreedYellow = previewCard(runechantOfGreedYellowRules);

const poundOfFleshBlue = previewCard(poundOfFleshBlueRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const embraceSinYellow = previewCard(embraceSinYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-embrace-sin-yellow",
  label: "Embrace Sin (yellow)",
  description:
    "happy: an eligible aura banished after resolution is playable this turn. Your next attack this turn gets +2{p}.\nYou may play an aura with Runechant in its name from your banished zone this turn.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "embrace-sin-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow, poundOfFleshBlue, runechantOfGreedYellow, woundingBlowBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.play(embraceSinYellow);
    game.untilIdle();
    Viserai.play(poundOfFleshBlue);
    game.untilIdle({ entityTargets: "pause" });
    Viserai.target(runechantOfGreedYellow);
    game.untilIdle({ entityTargets: "pause" });
    Dash.target(nimblismBlue);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-embrace-sin-yellow");
  },
};
