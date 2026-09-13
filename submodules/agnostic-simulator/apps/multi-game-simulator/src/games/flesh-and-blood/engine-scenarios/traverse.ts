import { oathOfTheArknightYellow } from "@tcg/flesh-and-blood-cards/cards/actions/oath-of-the-arknight";
import { readTheRunesYellow } from "@tcg/flesh-and-blood-cards/cards/actions/read-the-runes";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viseraiBetweenWorlds } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai-between-worlds";
import { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "@tcg/flesh-and-blood-cards/runtime-registry";
import { fabToken, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function physicalViseraiBetweenWorlds() {
  const card = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(viseraiBetweenWorlds.canonicalId);
  if (!card) throw new Error("Viserai, Between Worlds is missing its physical twin-card layout.");
  return card;
}

export const TRAVERSE_SCENARIOS = {
  "viserai-traverse-threshold": {
    id: "viserai-traverse-threshold",
    label: "Viserai · traverse threshold",
    description:
      "Gate to i'Arathael was activated and Viserai has created 1 Runechant this turn. Play Read the Runes (yellow) to create 2 more and traverse into Viserai, Usurper. Then pass priority to reach the end phase and choose Use effect to traverse back into Viserai, Between Worlds. Confirm both flips keep 17 life and the marked status.",
    group: "edge",
    tags: ["IAR", "Viserai", "traverse", "Runechant", "twin-card", "marked"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const viserai = physicalViseraiBetweenWorlds();
      const engine = FabTestEngine.start(
        {
          hero: viserai,
          hand: [previewCard(oathOfTheArknightYellow), previewCard(readTheRunesYellow)],
          arena: [fabToken("gate-to-i-arathael")],
          deck: Array.from({ length: 6 }, () => previewCard(snatchRed)),
          resourcePoints: 4,
          actionPoints: 1,
          life: 17,
          marked: true,
        },
        { hero: previewCard(dash), hand: [], life: 20, deck: 6 },
        MANUAL,
      );

      const player = engine.as(viserai);
      player.activate(fabToken("gate-to-i-arathael"));
      player.chooseTargets();
      engine.helpers.resolveUntilIdle();
      player.must.play(oathOfTheArknightYellow);
      engine.helpers.resolveUntilIdle();

      return matchFromEngine(engine, "viserai-traverse-threshold");
    },
  },
} satisfies FabScenarioCollection;
