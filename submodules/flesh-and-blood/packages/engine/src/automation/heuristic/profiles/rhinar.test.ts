import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { valueExtractStrategy } from "../goldfish.ts";
import { heroProfileStrategy } from "./dispatch.ts";
import { readRhinarHand } from "./rhinar.ts";
import { rhinarStrategy } from "./rhinar.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";

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

function rhinarSeat(hand: readonly string[], extras?: { actionPoints?: number }): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "rhinar-guide",
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [...hand],
        deck: 8,
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

function rhinarDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "rhinar-defend",
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.snatch],
        deck: 6,
      },
      player2: {
        heroCardId: catalogIds.rhinar,
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

describe("Rhinar masterclass profile", () => {
  it("plays Bloodrush when a blue, 6-power fuel, and a 2-cost threat are live", () => {
    const game = rhinarSeat([
      catalogIds.bloodrush,
      catalogIds.beastWithin,
      catalogIds.sandSketched,
      catalogIds.swingBig,
    ]);
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    expect(readRhinarHand(snapshot).bloodrushLive).toBe(true);

    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = rhinarStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.bloodrush);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals Bloodrush when the hand is yellow-clogged and cannot convert", () => {
    const clogged = rhinarSeat([
      catalogIds.bloodrush,
      catalogIds.sendPacking,
      catalogIds.crackedBauble,
      catalogIds.crackedBauble,
    ]);
    const snapshot = buildHeuristicSnapshot(
      clogged.getRuntime(),
      "player-1",
      buildFabRulesView(clogged.getState()),
    );
    expect(readRhinarHand(snapshot).bloodrushLive).toBe(false);

    const legal = listLegalCommands(clogged.getRuntime(), "player-1");
    const choice = rhinarStrategy(clogged.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(
      handInstance(clogged, "player-1", catalogIds.bloodrush),
    );
    expect(applyLegalCommand(clogged.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not spend Bloodrush or Beast Within defending a 4-power poke when the power turn is live", () => {
    const game = rhinarDefending([
      catalogIds.bloodrush,
      catalogIds.beastWithin,
      catalogIds.sandSketched,
      catalogIds.swingBig,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = rhinarStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.bloodrush);
    expect(names).not.toContain(catalogIds.beastWithin);
    expect(names).not.toContain(catalogIds.swingBig);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("prefers arsenaling a red 2-cost threat over a blue 5-power leftover", () => {
    const game = rhinarSeat([catalogIds.swingBig, catalogIds.blueFive, catalogIds.crackedBauble], {
      actionPoints: 0,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = rhinarStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(choice?.payload.arsenalInstanceId).toBe(
      handInstance(game, "player-1", catalogIds.swingBig),
    );
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("plays in-between disruption instead of a vanilla 4 when no power turn is ready", () => {
    const game = rhinarSeat([
      catalogIds.sendPacking,
      catalogIds.snatch,
      catalogIds.nimblismBlue,
      catalogIds.crackedBauble,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const goldfish = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    const choice = rhinarStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.sendPacking);
    expect(playedCanonical(game, goldfish!)).not.toBe("");
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Rhinar and leaves Bravo on the goldfish", () => {
    const rhinar = rhinarSeat([
      catalogIds.bloodrush,
      catalogIds.beastWithin,
      catalogIds.sandSketched,
      catalogIds.swingBig,
    ]);
    const rhinarChoice = heroProfileStrategy(
      rhinar.getRuntime(),
      "player-1",
      listLegalCommands(rhinar.getRuntime(), "player-1"),
    );
    expect(rhinarChoice?.move).toBe("begin-play");
    expect(playedCanonical(rhinar, rhinarChoice!)).toBe(catalogIds.bloodrush);

    const bravo = FabTestEngine.create(
      {
        seed: "bravo-dispatch",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [catalogIds.snatch, catalogIds.nimblismBlue],
          deck: 6,
          actionPoints: 1,
        },
        player2: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 6,
        },
        cardDefinitions: CARD_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const bravoChoice = heroProfileStrategy(
      bravo.getRuntime(),
      "player-1",
      listLegalCommands(bravo.getRuntime(), "player-1"),
    );
    expect(bravoChoice?.move).toBe("begin-play");
    expect(playedCanonical(bravo, bravoChoice!)).toBe(catalogIds.snatch);
  });
});
