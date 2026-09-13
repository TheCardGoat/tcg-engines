import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { lyathStrategy } from "./lyath.ts";

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

function playedCanonical(
  game: FabTestEngine,
  choice: { payload: Record<string, unknown> },
): string {
  return String(game.getState().objects[String(choice.payload.instanceId)]?.canonicalId);
}

function lyathSeat(
  hand: readonly string[],
  extras?: { arena?: readonly string[]; resourcePoints?: number },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "lyath-guide",
      player1: {
        heroCardId: catalogIds.lyath,
        hand: [...hand],
        deck: 8,
        arena: extras?.arena ? [...extras.arena] : undefined,
        actionPoints: 1,
        resourcePoints: extras?.resourcePoints ?? 0,
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function lyathDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "lyath-defend",
      player1: { heroCardId: catalogIds.bravo, hand: [catalogIds.snatch], deck: 6 },
      player2: { heroCardId: catalogIds.lyath, hand: [...hand], deck: 6 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(catalogIds.bravo).attackWith(catalogIds.snatch);
  return game;
}

describe("Lyath Goldmane Zero to Eighty profile", () => {
  it("plays Edge of Their Seats instead of Snatch to start stacking", () => {
    const game = lyathSeat([
      catalogIds.edgeOfTheirSeats,
      catalogIds.snatch,
      catalogIds.nimblismBlue,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = lyathStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.edgeOfTheirSeats);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("sends Tear Asunder once a suspense aura is already in the arena", () => {
    const game = lyathSeat([catalogIds.tearAsunder, catalogIds.snatch], {
      arena: [catalogIds.edgeOfTheirSeats],
      resourcePoints: 3,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = lyathStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.tearAsunder);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not block with Tear Asunder", () => {
    const game = lyathDefending([
      catalogIds.tearAsunder,
      catalogIds.edgeOfTheirSeats,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = lyathStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.tearAsunder);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });
});
