import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/viserai-between-worlds.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viseraiBetweenWorlds as viseraiBetweenWorldsRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai-between-worlds";

import { readTheRunesYellow as readTheRunesYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/read-the-runes";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viseraiBetweenWorlds = previewCard(viseraiBetweenWorldsRules);

const readTheRunesYellow = previewCard(readTheRunesYellowRules);
const snatchRed = previewCard(snatchRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-viserai-between-worlds",
  label: "Viserai, Between Worlds",
  description:
    "core mechanic: creating Runechants banishes top card of deck. Whenever you create 1 or more Runechants, banish the top card of your deck. Then if you've created 3 or more Runechants this turn, traverse.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "viserai-between-worlds"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const opponentHero = dash;

    const engine = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [readTheRunesYellow],
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed, // top of deck — this will be banished
        ],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viseraiBetweenWorlds);
    Viserai.must.play(readTheRunesYellow);
    game.helpers.resolveUntilIdle();
    return matchFromEngine(engine, "usurp-preview-viserai-between-worlds");
  },
};
