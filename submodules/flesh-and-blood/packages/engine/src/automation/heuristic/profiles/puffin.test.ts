import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { heroProfileStrategy } from "./dispatch.ts";
import { puffinStrategy } from "./puffin.ts";

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

function puffinSeat(hand: readonly string[], extras?: { resourcePoints?: number }): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "puffin-guide",
      player1: {
        heroCardId: catalogIds.puffin,
        hand: [...hand],
        deck: 8,
        actionPoints: 1,
        resourcePoints: extras?.resourcePoints ?? 0,
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function puffinDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "puffin-defend",
      player1: { heroCardId: catalogIds.bravo, hand: [catalogIds.snatch], deck: 6 },
      player2: { heroCardId: catalogIds.puffin, hand: [...hand], deck: 6 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(catalogIds.bravo).attackWith(catalogIds.snatch);
  return game;
}

describe("Puffin Zero to Eighty profile", () => {
  it("plays Cog in the Machine instead of Snatch so both cranks land", () => {
    const game = puffinSeat([
      catalogIds.cogInTheMachine,
      catalogIds.snatch,
      catalogIds.nimblismBlue,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = puffinStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.cogInTheMachine);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("sends Palantir Aeronought instead of Snatch as the 2-cost on-hit", () => {
    const game = puffinSeat([catalogIds.palantir, catalogIds.snatch], { resourcePoints: 2 });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = puffinStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.palantir);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not block with Palantir Aeronought", () => {
    const game = puffinDefending([
      catalogIds.palantir,
      catalogIds.cogInTheMachine,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = puffinStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.palantir);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Puffin", () => {
    const game = puffinSeat([catalogIds.cogInTheMachine, catalogIds.snatch]);
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.cogInTheMachine);
  });
});
