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
import { gravyRankingHint, gravyStrategy, readGravyBoard } from "./gravy.ts";

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

function gravySeat(
  hand: readonly string[],
  extras?: { graveyard?: readonly string[]; bluePutIntoGraveyard?: boolean },
): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "gravy-guide",
      player1: {
        heroCardId: catalogIds.gravy,
        hand: [...hand],
        deck: 8,
        graveyard: extras?.graveyard ? [...extras.graveyard] : undefined,
        actionPoints: 1,
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
  if (extras?.bluePutIntoGraveyard) {
    game.getState().players["player-1"]!.history.turn.bluePutIntoGraveyard = true;
  }
  return game;
}

function gravyDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "gravy-defend",
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.snatch],
        deck: 6,
      },
      player2: {
        heroCardId: catalogIds.gravy,
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

describe("Gravy Bones Zero to Eighty profile", () => {
  it("sends Golden Tipple instead of Snatch so the Pirate chain keeps going", () => {
    const game = gravySeat([catalogIds.goldenTipple, catalogIds.snatch, catalogIds.nimblismBlue]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = gravyStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.goldenTipple);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("prefers a graveyard ally once a blue has enabled Watery Grave", () => {
    const game = gravySeat([catalogIds.snatch, catalogIds.nimblismBlue], {
      graveyard: [catalogIds.riggermortis, catalogIds.lootTheHold],
      bluePutIntoGraveyard: true,
    });
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    const board = readGravyBoard(snapshot);
    expect(board.wateryGraveLive).toBe(true);
    const gyAlly = board.gyAllies.find((card) => card.canonicalId === catalogIds.riggermortis);
    expect(gyAlly).toBeDefined();
    expect(gravyRankingHint(snapshot).preferPlayInstanceId).toBe(gyAlly!.instanceId);
  });

  it("does not block with Golden Tipple or Riggermortis", () => {
    const game = gravyDefending([
      catalogIds.goldenTipple,
      catalogIds.riggermortis,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = gravyStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.goldenTipple);
    expect(names).not.toContain(catalogIds.riggermortis);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Gravy Bones", () => {
    const game = gravySeat([catalogIds.goldenTipple, catalogIds.snatch]);
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.goldenTipple);
  });
});
