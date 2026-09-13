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
import { readZyggyBoard, zyggyStrategy } from "./zyggy.ts";

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

function zyggySeat(
  hand: readonly string[],
  extras?: { arena?: readonly string[]; resourcePoints?: number },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "zyggy-guide",
      player1: {
        heroCardId: catalogIds.zyggy,
        hand: [...hand],
        deck: 8,
        arena: extras?.arena ? [...extras.arena] : undefined,
        actionPoints: 1,
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

function zyggyDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "zyggy-defend",
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.snatch],
        deck: 6,
      },
      player2: {
        heroCardId: catalogIds.zyggy,
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

describe("Zyggy Zero to Eighty profile", () => {
  it("plays Nebulus Cycle before a generic attack so Reality Refractor has an aura", () => {
    const game = zyggySeat([catalogIds.nebulus, catalogIds.snatch, catalogIds.nimblismBlue]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = zyggyStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.nebulus);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("sends Phantasmaclasm once an aura is already in the arena", () => {
    const game = zyggySeat([catalogIds.phantasmaclasm, catalogIds.snatch], {
      arena: [catalogIds.nebulus],
      resourcePoints: 3,
    });
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    expect(readZyggyBoard(snapshot).auras).toHaveLength(1);

    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = zyggyStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.phantasmaclasm);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not block with Phantasmaclasm", () => {
    const game = zyggyDefending([
      catalogIds.phantasmaclasm,
      catalogIds.nebulus,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = zyggyStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.phantasmaclasm);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Zyggy", () => {
    const game = zyggySeat([catalogIds.nebulus, catalogIds.snatch]);
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.nebulus);
  });
});
