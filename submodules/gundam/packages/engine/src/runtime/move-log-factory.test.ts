import { describe, expect, it } from "vitest";

import type { CommandEnvelope } from "../types/command.ts";
import type { PlayerId } from "../types/branded.ts";
import type { GameLogEntry } from "../types/game-events.ts";
import { buildGundamMoveLog } from "./move-log-factory.ts";
import { stripPrivateFields } from "./private-field.ts";

const PLAYER_ONE = "player_one" as PlayerId;

function command(move: string): CommandEnvelope {
  return {
    commandID: `cmd-${move}`,
    move,
    prevStateID: 1,
    actorRole: "player",
    args: {},
  };
}

function commandWithArgs(move: string, args: Record<string, unknown>): CommandEnvelope {
  return { ...command(move), args };
}

function entry(
  type: string,
  values: Record<string, unknown>,
  category: "action" | "system" = "action",
): GameLogEntry {
  return {
    id: 1,
    stateID: 2,
    timestamp: 100,
    type,
    message: "",
    data: {
      type,
      values,
      visibility: { mode: "PUBLIC" },
      category,
    },
    visibleTo: "all",
  };
}

describe("buildGundamMoveLog", () => {
  it("builds deploy logs with cost outcomes attached", () => {
    const log = buildGundamMoveLog({
      command: command("deployUnit"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry("gundam.cost.resourcesSpent", {
          playerId: PLAYER_ONE,
          regularCount: 2,
          exRemovedCount: 1,
        }),
        entry("gundam.move.deployUnit", {
          playerId: PLAYER_ONE,
          cardId: "unit_1",
          cost: 3,
        }),
      ],
    });

    expect(log).toMatchObject({
      type: "deployUnit",
      playerId: PLAYER_ONE,
      cardId: "unit_1",
      cost: 3,
      outcomes: {
        resourcesSpent: { regularCount: 2, exRemovedCount: 1 },
      },
    });
  });

  it("builds attack logs with combat outcomes nested under the action", () => {
    const log = buildGundamMoveLog({
      command: command("enterBattle"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry("gundam.move.attackDeclared", {
          attackerPlayerId: PLAYER_ONE,
          attackerId: "attacker_1",
          targetId: "defender_1",
        }),
        entry("gundam.combat.damageDealt", {
          cardId: "defender_1",
          sourceCardId: "attacker_1",
          amount: 4,
        }),
        entry("gundam.combat.unitDefeated", {
          cardId: "defender_1",
          ownerId: "player_two",
          defeatedBy: "attacker_1",
        }),
      ],
    });

    expect(log).toMatchObject({
      type: "attack",
      attackerId: "attacker_1",
      targetId: "defender_1",
      outcomes: {
        damageDealt: [{ sourceCardId: "attacker_1", targetId: "defender_1", amount: 4 }],
        unitsDefeated: [{ cardId: "defender_1", ownerId: "player_two", defeatedBy: "attacker_1" }],
      },
    });
  });

  it("keeps stat modifier outcomes attached to the resolving move", () => {
    const log = buildGundamMoveLog({
      command: command("resolveEffect"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry(
          "gundam.pending.resolved",
          { effectId: "effect_1", sourceCardId: "source_1" },
          "system",
        ),
        entry("gundam.effect.statModified", {
          cardId: "target_1",
          stat: "ap",
          amount: -2,
          duration: "thisTurn",
        }),
      ],
    });

    expect(log?.outcomes?.statModifiers).toEqual([
      { cardId: "target_1", stat: "ap", amount: -2, duration: "thisTurn" },
    ]);
  });

  it("builds mulligan logs with private returned/drawn card ids", () => {
    const log = buildGundamMoveLog({
      command: command("alterHand"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry("gundam.setup.mulligan", { playerId: PLAYER_ONE, count: 5 }),
        {
          id: 2,
          stateID: 2,
          timestamp: 100,
          type: "gundam.setup.mulligan",
          message: "",
          data: {
            type: "gundam.setup.mulligan",
            values: {
              playerId: PLAYER_ONE,
              count: 5,
              returnedCardIds: ["ret_1", "ret_2", "ret_3", "ret_4", "ret_5"],
              drawnCardIds: ["draw_1", "draw_2", "draw_3", "draw_4", "draw_5"],
            },
            visibility: { mode: "PRIVATE", visibleTo: [PLAYER_ONE] },
            category: "action",
          },
          visibleTo: [PLAYER_ONE],
        },
      ],
    });

    if (log?.type !== "mulligan") throw new Error("Expected mulligan log");
    expect(log.count).toBe(5);
    expect(log.returnedCardIds).toMatchObject({
      __private: true,
      value: ["ret_1", "ret_2", "ret_3", "ret_4", "ret_5"],
      visibleTo: [PLAYER_ONE],
    });
    expect(log.drawnCardIds).toMatchObject({
      __private: true,
      value: ["draw_1", "draw_2", "draw_3", "draw_4", "draw_5"],
      visibleTo: [PLAYER_ONE],
    });

    const opponentView = stripPrivateFields(log, "player_two");
    const ownerView = stripPrivateFields(log, PLAYER_ONE);
    expect(opponentView?.count).toBe(5);
    expect(opponentView?.returnedCardIds).toBeUndefined();
    expect(opponentView?.drawnCardIds).toBeUndefined();
    expect(JSON.stringify(opponentView)).not.toContain("ret_1");
    expect(ownerView?.returnedCardIds).toEqual(["ret_1", "ret_2", "ret_3", "ret_4", "ret_5"]);
    expect(ownerView?.drawnCardIds).toEqual(["draw_1", "draw_2", "draw_3", "draw_4", "draw_5"]);
  });

  it("builds keep-hand mulligan logs without private card fields", () => {
    const log = buildGundamMoveLog({
      command: command("alterHand"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [entry("gundam.setup.mulligan", { playerId: PLAYER_ONE, count: 0 })],
    });
    if (log?.type !== "mulligan") throw new Error("Expected mulligan log");
    expect(log.count).toBe(0);
    expect(log.returnedCardIds).toBeUndefined();
    expect(log.drawnCardIds).toBeUndefined();
  });

  it("keeps drawn card details as field-level private data", () => {
    const log = buildGundamMoveLog({
      command: command("activateAbility"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry("gundam.move.activateAbility", {
          playerId: PLAYER_ONE,
          cardId: "source_1",
          effectIndex: 0,
        }),
        entry("gundam.effect.cardsDrawn", {
          playerId: PLAYER_ONE,
          count: 2,
          cardIds: ["drawn_1", "drawn_2"],
        }),
      ],
    });

    if (log?.type !== "resolveEffect") {
      throw new Error("Expected resolveEffect log");
    }

    expect(log.outcomes?.cardsDrawn?.cardIds).toMatchObject({
      __private: true,
      value: ["drawn_1", "drawn_2"],
      visibleTo: [PLAYER_ONE],
    });
    const opponentView = stripPrivateFields(log, "player_two");
    const ownerView = stripPrivateFields(log, PLAYER_ONE);
    expect(opponentView).toBeDefined();
    expect(ownerView).toBeDefined();
    if (!opponentView || !ownerView) {
      throw new Error("Expected stripped log views");
    }
    expect(opponentView.outcomes?.cardsDrawn?.cardIds).toBeUndefined();
    expect("cardIds" in opponentView.outcomes!.cardsDrawn!).toBe(false);
    expect(JSON.stringify(opponentView)).not.toContain("drawn_1");
    expect(ownerView.outcomes?.cardsDrawn?.cardIds).toEqual(["drawn_1", "drawn_2"]);
  });

  it("preserves manually selected effect targets for animation projection", () => {
    const log = buildGundamMoveLog({
      command: commandWithArgs("resolveEffect", {
        pendingEffectId: "effect_1",
        targets: ["receiver_1"],
      }),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry(
          "gundam.pending.resolved",
          { effectId: "effect_1", sourceCardId: "supporter_1" },
          "system",
        ),
      ],
    });

    expect(log).toMatchObject({
      type: "resolveEffect",
      sourceCardId: "supporter_1",
      resolution: { kind: "targetSelection", targets: ["receiver_1"] },
    });
  });

  it("marks every safe pass context as automatic from emitted logs and command fallback", () => {
    const cases = [
      ["passBlock", "block"],
      ["passBattleAction", "battle"],
      ["passActionStep", "action-step"],
    ] as const;

    for (const [move, context] of cases) {
      const fromEntry = buildGundamMoveLog({
        command: commandWithArgs(move, { automatic: true }),
        playerId: PLAYER_ONE,
        timestamp: 100,
        logEntries: [
          entry("gundam.move.pass", {
            playerId: PLAYER_ONE,
            context,
            automatic: true,
          }),
        ],
      });
      const fromCommand = buildGundamMoveLog({
        command: commandWithArgs(move, { automatic: true }),
        playerId: PLAYER_ONE,
        timestamp: 100,
        logEntries: [],
      });

      expect(fromEntry).toMatchObject({ type: "pass", context, automatic: true });
      expect(fromCommand).toMatchObject({ type: "pass", context, automatic: true });
    }
  });

  it("leaves manual action-step passes unflagged", () => {
    const log = buildGundamMoveLog({
      command: command("passActionStep"),
      playerId: PLAYER_ONE,
      timestamp: 100,
      logEntries: [
        entry("gundam.move.pass", {
          playerId: PLAYER_ONE,
          context: "action-step",
        }),
      ],
    });

    expect(log).toMatchObject({ type: "pass", context: "action-step" });
    expect(log && "automatic" in log ? log.automatic : undefined).toBeUndefined();
  });
});
