import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import { readTekloBoard, teklovossenStrategy } from "./teklovossen.ts";

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

function tekloSeat(
  hand: readonly string[],
  extras?: { banished?: readonly string[]; actionPoints?: number },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "teklo-guide",
      player1: {
        heroCardId: catalogIds.teklovossen,
        hand: [...hand],
        deck: 8,
        banished: extras?.banished ? [...extras.banished] : undefined,
        actionPoints: extras?.actionPoints ?? 1,
        resourcePoints: 0,
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

function tekloDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "teklo-defend",
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.snatch],
        deck: 6,
      },
      player2: {
        heroCardId: catalogIds.teklovossen,
        hand: [...hand],
        deck: 6,
      },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(catalogIds.bravo).attackWith(catalogIds.snatch);
  return game;
}

describe("Teklovossen masterclass profile", () => {
  it("boosts Zero to Sixty instead of playing an Evo from hand", () => {
    const game = tekloSeat([
      catalogIds.zeroToSixty,
      catalogIds.evoBetaLegs,
      catalogIds.nimblismBlue,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = teklovossenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.zeroToSixty);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals Fabricate as the premium leftover", () => {
    const game = tekloSeat([catalogIds.fabricate, catalogIds.crackedBauble], { actionPoints: 0 });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = teklovossenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(
      handInstance(game, "player-1", catalogIds.fabricate),
    );
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("keeps a boost attack in hand and blocks a 4 with Firewall instead", () => {
    const game = tekloDefending([
      catalogIds.zeroToSixty,
      catalogIds.firewall,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = teklovossenStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.zeroToSixty);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("does not spend Singularity as a block", () => {
    const game = tekloDefending([
      catalogIds.singularity,
      catalogIds.firewall,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = teklovossenStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.singularity);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("prefers the banished Beta Base that matches a banished Steel Soul", () => {
    const game = tekloSeat([catalogIds.nimblismBlue], {
      banished: [catalogIds.evoBetaLegs, catalogIds.evoSoulTower],
    });
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    const board = readTekloBoard(snapshot);
    expect(board.banishedEvos).toHaveLength(2);
    const legs = snapshot.banished.find((card) => card.canonicalId === catalogIds.evoBetaLegs);
    expect(legs).toBeDefined();
    expect(board.banishedEvos.some((card) => card.canonicalId === catalogIds.evoBetaLegs)).toBe(
      true,
    );
  });
});
