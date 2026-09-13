import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { heroProfileStrategy } from "./dispatch.ts";
import { auroraStrategy } from "./aurora.ts";

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

function auroraSeat(
  hand: readonly string[],
  extras?: {
    arena?: readonly string[];
    actionPoints?: number;
    resourcePoints?: number;
  },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "aurora-guide",
      player1: {
        heroCardId: catalogIds.aurora,
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

function auroraDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "aurora-defend",
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.snatch],
        deck: 6,
      },
      player2: {
        heroCardId: catalogIds.aurora,
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

describe("Aurora Zero to Eighty profile", () => {
  it("sends Lightning Surge instead of finishing with Snatch", () => {
    const game = auroraSeat([
      catalogIds.lightningSurge,
      catalogIds.snatch,
      catalogIds.nimblismBlue,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = auroraStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.lightningSurge);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("sends Gone in a Flash when an instant is in hand", () => {
    const game = auroraSeat([catalogIds.goneInAFlash, catalogIds.sigilSolace, catalogIds.snatch]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = auroraStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.goneInAFlash);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals Fry instead of a leftover blue", () => {
    const game = auroraSeat([catalogIds.fry, catalogIds.nimblismBlue], { actionPoints: 0 });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = auroraStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(handInstance(game, "player-1", catalogIds.fry));
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not block with Lightning Surge, Fry, or Gone in a Flash", () => {
    const game = auroraDefending([
      catalogIds.lightningSurge,
      catalogIds.fry,
      catalogIds.goneInAFlash,
      catalogIds.nimblismBlue,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = auroraStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.lightningSurge);
    expect(names).not.toContain(catalogIds.fry);
    expect(names).not.toContain(catalogIds.goneInAFlash);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Aurora", () => {
    const game = auroraSeat([catalogIds.lightningSurge, catalogIds.snatch]);
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.lightningSurge);
  });
});
