import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import { catalogIds, SPLATTER_SKULL_ID, RAVENOUS_MEATAXE_ID, realCardDefinition } from "./cards";
import { matchFromEngine, createEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

function bootEndgame(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-endgame",
    player1: {
      heroCardId: catalogIds.bravo,
      life: 4,
      weapon1: [catalogIds.anothos],
      head: [catalogIds.helmIron],
      hand: [catalogIds.disable, catalogIds.crackedBauble, catalogIds.crackedBauble],
      // Anothos gets +2 power while at least two cost-3-or-greater cards are
      // in pitch. This fixture deliberately starts with that condition met so
      // its documented 6-life endgame is a genuine lethal-line browser test.
      pitch: [catalogIds.disable, catalogIds.disable],
      graveyard: [catalogIds.snatch, catalogIds.enlightenedStrike],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.rhinar,
      life: 6,
      weapon1: [catalogIds.rompingClub],
      legs: [catalogIds.scabskin],
      hand: [catalogIds.wreckerRomp, catalogIds.sinkBelow],
      graveyard: [catalogIds.primevalBellow],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-endgame");
}

function bootAttackActionLethal(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-attack-action-lethal",
    cardDefinitions: { [SPLATTER_SKULL_ID]: realCardDefinition(SPLATTER_SKULL_ID) },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [SPLATTER_SKULL_ID, catalogIds.nimblismBlue],
      deck: 6,
      actionPoints: 1,
    },
    player2: { heroCardId: catalogIds.bravo, life: 6, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-attack-action-lethal");
}

function bootWeaponLethal(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-weapon-lethal",
    cardDefinitions: { [RAVENOUS_MEATAXE_ID]: realCardDefinition(RAVENOUS_MEATAXE_ID) },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [RAVENOUS_MEATAXE_ID],
      hand: [],
      deck: [catalogIds.nimblismBlue, catalogIds.alphaRampage],
      resourcePoints: 2,
      actionPoints: 1,
    },
    player2: { heroCardId: catalogIds.bravo, life: 3, hand: [], deck: 6 },
  });
  return matchFromEngine(engine, "fab-scenario-weapon-lethal");
}

export const EDGE_SCENARIOS = {
  endgame: {
    id: "endgame",
    label: "Low-life endgame",
    description: "Bravo at 4 life vs Rhinar at 6 — action phase pressure.",
    group: "edge",
    tags: ["engine", "endgame", "closed"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootEndgame,
  },
  "phase-turn-announcement-lab": {
    id: "phase-turn-announcement-lab",
    label: "Turn announcement",
    description:
      "A settled action-phase board for reviewing the next-player turn announcement after a complete pass.",
    group: "edge",
    tags: ["engine", "animation", "turn", "announcement", "board-center"],
    viewerId: "player-1",
    // The opponent passes automatically, so one End turn action reaches the
    // complete boundary sequence without swapping to a second local seat.
    botMode: "pass-only",
    boot: bootEndgame,
  },
  "attack-action-lethal": {
    id: "attack-action-lethal",
    label: "Attack-action lethal",
    description: "Splatter Skull can visibly finish a 6-life opposing hero.",
    group: "edge",
    tags: ["engine", "terminal", "lethal", "attack-action"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootAttackActionLethal,
  },
  "weapon-lethal": {
    id: "weapon-lethal",
    label: "Weapon lethal",
    description: "Ravenous Meataxe can visibly finish a 3-life opposing hero.",
    group: "edge",
    tags: ["engine", "terminal", "lethal", "weapon"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootWeaponLethal,
  },
} satisfies FabScenarioCollection;
