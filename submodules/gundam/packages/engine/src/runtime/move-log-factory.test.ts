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
});
