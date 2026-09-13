import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import { heroProfileStrategy } from "./dispatch.ts";
import { readValdaBoard, valdaStrategy } from "./valda.ts";

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

function valdaSeat(
  hand: readonly string[],
  extras?: {
    arena?: readonly string[];
    actionPoints?: number;
    resourcePoints?: number;
  },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "valda-guide",
      player1: {
        heroCardId: catalogIds.valda,
        hand: [...hand],
        deck: 8,
        arena: extras?.arena ? [...extras.arena] : undefined,
        actionPoints: extras?.actionPoints ?? 1,
        resourcePoints: extras?.resourcePoints ?? 0,
      },
      player2: {
        heroCardId: catalogIds.bravo,
        hand: [],
        deck: 8,
      },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

describe("Valda masterclass profile", () => {
  it("plays Ley Line of the Old Ones before a crush haymaker", () => {
    const game = valdaSeat([catalogIds.leyLine, catalogIds.disable, catalogIds.nimblismBlue], {
      resourcePoints: 3,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valdaStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.leyLine);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("sends Disable when three Seismic Surges make dominate live", () => {
    const game = valdaSeat([catalogIds.disable, catalogIds.snatch, catalogIds.nimblismBlue], {
      arena: [catalogIds.seismicSurge, catalogIds.seismicSurge, catalogIds.seismicSurge],
      resourcePoints: 3,
    });
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    const board = readValdaBoard(snapshot);
    expect(board.surges).toBe(3);
    expect(board.dominateReady).toBe(true);

    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valdaStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.disable);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals Seismic Eruption instead of a leftover blue", () => {
    const game = valdaSeat([catalogIds.seismicEruption, catalogIds.nimblismBlue], {
      actionPoints: 0,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valdaStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(
      handInstance(game, "player-1", catalogIds.seismicEruption),
    );
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("ends the turn with an empty arsenal so Disenchantment can heave", () => {
    const game = valdaSeat([catalogIds.disenchantment, catalogIds.nimblismBlue], {
      actionPoints: 0,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valdaStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBeUndefined();
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Valda", () => {
    const game = valdaSeat([catalogIds.leyLine, catalogIds.disable], { resourcePoints: 3 });
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.leyLine);
  });
});
