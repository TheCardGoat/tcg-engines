import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { heroProfileStrategy } from "./dispatch.ts";
import { marlynnStrategy } from "./marlynn.ts";

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

function handInstance(game: FabTestEngine, playerId: string, canonicalId: string): string {
  const match = game
    .getState()
    .containers.zonesByPlayerId[playerId]!.hand.find(
      (id) => game.getState().objects[id]?.canonicalId === canonicalId,
    );
  if (!match) throw new Error(`Expected ${canonicalId} in ${playerId} hand.`);
  return match;
}

function marlynnSeat(hand: readonly string[], extras?: { actionPoints?: number }): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "marlynn-guide",
      player1: {
        heroCardId: catalogIds.marlynn,
        hand: [...hand],
        deck: 8,
        actionPoints: extras?.actionPoints ?? 1,
        resourcePoints: 0,
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function marlynnDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "marlynn-defend",
      player1: { heroCardId: catalogIds.bravo, hand: [catalogIds.snatch], deck: 6 },
      player2: { heroCardId: catalogIds.marlynn, hand: [...hand], deck: 6 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(catalogIds.bravo).attackWith(catalogIds.snatch);
  return game;
}

describe("Marlynn Zero to Eighty profile", () => {
  it("plays Take Aim instead of Snatch so a harpoon can be loaded", () => {
    const game = marlynnSeat([catalogIds.takeAim, catalogIds.snatch, catalogIds.nimblismBlue]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = marlynnStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.takeAim);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals King Shark Harpoon as the leftover", () => {
    const game = marlynnSeat([catalogIds.kingShark, catalogIds.nimblismBlue], {
      actionPoints: 0,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = marlynnStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(
      handInstance(game, "player-1", catalogIds.kingShark),
    );
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not block with King Shark Harpoon", () => {
    const game = marlynnDefending([
      catalogIds.kingShark,
      catalogIds.takeAim,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = marlynnStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.kingShark);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Marlynn", () => {
    const game = marlynnSeat([catalogIds.takeAim, catalogIds.snatch]);
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.takeAim);
  });
});
