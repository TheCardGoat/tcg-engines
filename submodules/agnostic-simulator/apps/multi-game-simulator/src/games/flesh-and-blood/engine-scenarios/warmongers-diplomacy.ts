import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import type { FabTestFixture, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { catalogIds, realCardDefinition, warmongerSDiplomacyBlue } from "./cards";
import { createEngine, matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

/**
 * Shared match shape for the Warmonger's Diplomacy QA fixtures. The diplomacy
 * card starts in the seat named by `diplomacyHand` (together with a small
 * utility hand) so each scenario controls who plays it.
 */
function warmongersDiplomacyFixture(
  seed: string,
  diplomacyHand: "player1" | "player2",
): FabTestFixture {
  const hand: string[] = [
    warmongerSDiplomacyBlue.canonicalId,
    catalogIds.nimblismBlue,
    catalogIds.sinkBelow,
  ];
  const otherHand: string[] = [catalogIds.nimblismBlue, catalogIds.sinkBelow];
  return {
    seed,
    cardDefinitions: {
      [warmongerSDiplomacyBlue.canonicalId]: realCardDefinition(
        warmongerSDiplomacyBlue.canonicalId,
      ),
    },
    player1: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      hand: diplomacyHand === "player1" ? hand : otherHand,
      deck: 6,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: diplomacyHand === "player1" ? otherHand : hand,
      deck: 6,
    },
  };
}

function passUntilDecision(game: FabTestEngine): void {
  for (let step = 0; step < 8; step += 1) {
    const wait = game.getRuntime().waitState();
    if (wait.kind !== "priority") return;
    game.pass(wait.playerId);
  }
  throw new Error("Warmonger's Diplomacy fixture priority never resolved into a decision.");
}

function bootWarmongersDiplomacyChoice(): FabPracticeMatch {
  const game = createEngine(
    warmongersDiplomacyFixture("fab-scenario-warmongers-diplomacy-choice", "player2"),
  );
  game.as(catalogIds.bravo).endTurn();
  game.as(catalogIds.rhinar).play(warmongerSDiplomacyBlue.canonicalId);
  // Pass the played layer through both seats so the resolution reaches the
  // war-or-peace decision; the prompts run in seat order, so the viewer
  // (player-1) answers first.
  passUntilDecision(game);
  const wait = game.getRuntime().waitState();
  if (wait.kind !== "decision" || wait.decision.kind !== "effect-resolution") {
    throw new Error("Warmonger's Diplomacy choice fixture did not reach its decision.");
  }
  return matchFromEngine(game, "fab-scenario-warmongers-diplomacy-choice");
}

function bootWarmongersDiplomacyResolved(): FabPracticeMatch {
  const game = createEngine(
    warmongersDiplomacyFixture("fab-scenario-warmongers-diplomacy-resolved", "player1"),
  );
  // The viewer opens their own turn at priority with Warmonger's Diplomacy in
  // hand — nothing has been played yet, so QA drives the play, the
  // war-or-peace answers, and both restricted turns live.
  const wait = game.getRuntime().waitState();
  if (wait.kind !== "priority" || wait.playerId !== "player-1") {
    throw new Error(
      "Warmonger's Diplomacy resolved fixture did not open at the viewer's action phase.",
    );
  }
  return matchFromEngine(game, "fab-scenario-warmongers-diplomacy-resolved");
}

export const WARMONGERS_DIPLOMACY_SCENARIOS = {
  "warmongers-diplomacy-choice": {
    id: "warmongers-diplomacy-choice",
    label: "Warmonger's Diplomacy · war-or-peace prompt",
    description:
      "The opponent played Warmonger's Diplomacy and its layer resolved, so the hero to their left — the viewer — must choose war or peace first. Freezes at that prompt to validate the chooser, the stack, and the opponent-play history row.",
    group: "opening",
    tags: [
      "engine",
      "warmongers-diplomacy",
      "choose-option",
      "opponent-play",
      "history-log",
      "real-card",
    ],
    viewerId: "player-1",
    botMode: "off",
    boot: bootWarmongersDiplomacyChoice,
  },
  "warmongers-diplomacy-resolved": {
    id: "warmongers-diplomacy-resolved",
    label: "Warmonger's Diplomacy · about to play",
    description:
      "Your turn, priority is yours, and Warmonger's Diplomacy is in hand with an action point to spend. Play it to open the war-or-peace prompts (the hero to your left answers first), then watch both heroes' following turns restrict accordingly. The history should read your play once made.",
    group: "opening",
    tags: [
      "engine",
      "warmongers-diplomacy",
      "choose-option",
      "restriction",
      "viewer-play",
      "history-log",
      "real-card",
    ],
    viewerId: "player-1",
    botMode: "off",
    boot: bootWarmongersDiplomacyResolved,
  },
} satisfies FabScenarioCollection;
