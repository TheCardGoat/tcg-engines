import { FabTestEngine, type FabTestFixture } from "@tcg/flesh-and-blood-engine/testing";
import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";

import { catalogIds, DEFS, VISUAL_DECK_CARD_ID } from "./cards";

export function matchFromEngine(
  engine: FabTestEngine,
  seed: string,
  player1Id = "player-1",
  player2Id = "player-2",
): FabPracticeMatch {
  return {
    runtime: engine.getRuntime(),
    engine,
    player1Id,
    player2Id,
    seed,
  };
}

export function createEngine(fixture: FabTestFixture): FabTestEngine {
  return FabTestEngine.create(
    {
      ...fixture,
      fillerCardId: VISUAL_DECK_CARD_ID,
      cardDefinitions: { ...DEFS, ...fixture.cardDefinitions },
    },
    // Visual scenarios intentionally stop at a player-visible priority or
    // decision window; smart harness auto-passing would resolve past it.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

export function playAttackToDefendStep(
  game: FabTestEngine,
  attackerHero: string,
  attackCard: string,
  defenderHero: string,
  pitch?: readonly string[],
): void {
  const attacker = game.as(attackerHero);
  const defender = game.as(defenderHero);
  attacker.attackWith(attackCard, {
    target: defender.id,
    ...(pitch && pitch.length > 0 ? { pitch: [...pitch] } : {}),
  });
}

export function rhinarBravoBase(
  seed: string,
  seats: {
    player1?: FabTestFixture["player1"];
    player2?: FabTestFixture["player2"];
  } = {},
): FabTestFixture {
  return {
    seed,
    player1Id: "player-1",
    player2Id: "player-2",
    firstPlayerId: "player-1",
    cardDefinitions: DEFS,
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      legs: [catalogIds.scabskin],
      hand: [
        catalogIds.alphaRampage,
        catalogIds.nimblismBlue,
        catalogIds.nimblismBlue,
        catalogIds.nimblismBlue,
        catalogIds.wreckerRomp,
      ],
      deck: 12,
      actionPoints: 1,
      resourcePoints: 0,
      ...seats.player1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      head: [catalogIds.helmIron],
      hand: [
        catalogIds.sinkBelow,
        catalogIds.enlightenedStrike,
        catalogIds.unmovable,
        catalogIds.crackedBauble,
      ],
      deck: 12,
      ...seats.player2,
    },
  };
}
