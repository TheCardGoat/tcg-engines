import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { arakniStrategy } from "./arakni.ts";
import { heroProfileStrategy } from "./dispatch.ts";

const CARD_DEFINITIONS = CATALOG_TEST_DEFINITIONS;

function applyLegalCommand(
  runtime: FabMatchRuntime,
  actorId: string,
  command: {
    readonly move: Parameters<typeof decodeFabCommand>[0];
    readonly payload: Record<string, unknown>;
  },
) {
  const decoded = decodeFabCommand(command.move, command.payload);
  if (!decoded) throw new Error(`Generated legal command ${command.move} did not decode.`);
  return runtime.applyCommand(actorId, decoded);
}

function handInstance(game: FabTestEngine, playerId: string, canonicalId: string): string {
  const match = game
    .getState()
    .containers.zonesByPlayerId[playerId]!.hand.find(
      (id) => game.getState().objects[id]?.canonicalId === canonicalId,
    );
  if (!match) throw new Error(`Expected ${canonicalId} in ${playerId} hand.`);
  return match;
}

function playedCanonical(
  game: FabTestEngine,
  choice: { payload: Record<string, unknown> },
): string {
  return String(game.getState().objects[String(choice.payload.instanceId)]?.canonicalId);
}

function arakniSeat(
  hand: readonly string[],
  extras?: { opponentMarked?: boolean; actionPoints?: number },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "arakni-guide",
      player1: {
        heroCardId: catalogIds.arakni,
        hand: [...hand],
        deck: 8,
        actionPoints: extras?.actionPoints ?? 1,
        resourcePoints: 0,
      },
      player2: {
        heroCardId: catalogIds.bravo,
        hand: [],
        deck: 8,
        marked: extras?.opponentMarked ?? false,
      },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

describe("Arakni masterclass profile", () => {
  it("sends Mark of the Black Widow when the opponent is marked", () => {
    const game = arakniSeat([catalogIds.blackWidow, catalogIds.snatch, catalogIds.nimblismBlue], {
      opponentMarked: true,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = arakniStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.blackWidow);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals Tarantula Toxin instead of a leftover blue", () => {
    const game = arakniSeat([catalogIds.tarantulaToxin, catalogIds.nimblismBlue], {
      actionPoints: 0,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = arakniStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(
      handInstance(game, "player-1", catalogIds.tarantulaToxin),
    );
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Arakni", () => {
    const game = arakniSeat([catalogIds.kissOfDeath, catalogIds.snatch], {
      opponentMarked: true,
    });
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.kissOfDeath);
  });
});

describe("Arakni mark mechanic (engine-debt modeling)", () => {
  it("the Marionette Dagger marks the opposing hero when it hits", () => {
    const game = FabTestEngine.create({
      seed: "arakni-mark",
      player1: {
        heroCardId: catalogIds.arakni,
        hand: [],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 2,
        weapon1: [catalogIds.arakniDagger],
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 6 },
      cardDefinitions: CARD_DEFINITIONS,
    });
    game.as(catalogIds.arakni).activateAttack(catalogIds.arakniDagger);
    game.as(catalogIds.bravo).defendWith([]);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players["player-2"]!.marked).toBe(true);
  });
});
