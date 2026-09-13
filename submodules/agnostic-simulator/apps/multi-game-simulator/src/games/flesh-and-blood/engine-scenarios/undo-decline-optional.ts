import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { danseMacabre } from "@tcg/flesh-and-blood-cards/cards/equipment/danse-macabre";
import { restlessMagisterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const UNDO_DECLINE_OPTIONAL_SCENARIOS = {
  "undo-decline-danse-macabre": {
    id: "undo-decline-danse-macabre",
    label: "Undo — decline Danse Macabre after ally play",
    description:
      "Malice starts with Restless Magister in hand, Danse Macabre equipped, and one action point. Play the Magister, pass so it enters the arena, decline the Danse Macabre optional, then Undo: the whole play rolls back to the pre-play state instead of re-opening the declined prompt.",
    group: "edge",
    tags: ["undo", "optional", "danse-macabre", "restless-magister", "regression"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: malice,
          legs: [danseMacabre],
          hand: [restlessMagisterRed],
          actionPoints: 1,
          resourcePoints: 0,
          deck: 6,
          life: 20,
        },
        { hero: dash, hand: [], deck: 6, life: 20 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      return matchFromEngine(engine, "undo-decline-danse-macabre");
    },
  },
} satisfies FabScenarioCollection;
