/// <reference types="node" />

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GRAND_ARCHIVE_MOVE_NAMES, type GrandArchiveCommand } from "./commands.ts";
import {
  routeGrandArchiveCommand,
  type GrandArchiveCommandFor,
  type GrandArchiveCommandHandlers,
} from "./command-router.ts";
import {
  grandArchiveDecisionId,
  grandArchiveObjectId,
  grandArchivePlayerId,
} from "../game/identity.ts";

type RoutedCommand = {
  readonly playerId: ReturnType<typeof grandArchivePlayerId>;
  readonly command: GrandArchiveCommand;
};

const handlers = {
  pass: (playerId, command) => ({ playerId, command }),
  concede: (playerId, command) => ({ playerId, command }),
  "skip-materialization": (playerId, command) => ({ playerId, command }),
  "return-preserved-card": (playerId, command) => ({ playerId, command }),
  materialize: (playerId, command) => ({ playerId, command }),
  "bestow-boon": (playerId, command) => ({ playerId, command }),
  "start-pregame-card": (playerId, command) => ({ playerId, command }),
  "complete-pregame-actions": (playerId, command) => ({ playerId, command }),
  "activate-card": (playerId, command) => ({ playerId, command }),
  "activate-ability": (playerId, command) => ({ playerId, command }),
  "declare-attack": (playerId, command) => ({ playerId, command }),
  "answer-decision": (playerId, command) => ({ playerId, command }),
} satisfies GrandArchiveCommandHandlers<RoutedCommand>;

const objectId = grandArchiveObjectId("card-1");
const commands = [
  { move: "pass" },
  { move: "concede" },
  { move: "skip-materialization" },
  {
    move: "return-preserved-card",
    cardId: objectId,
  },
  { move: "materialize", cardId: objectId },
  { move: "bestow-boon", cardId: objectId },
  { move: "start-pregame-card", cardId: objectId },
  { move: "complete-pregame-actions" },
  { move: "activate-card", cardId: objectId },
  { move: "activate-ability", sourceId: objectId, abilityId: "ability-1" },
  { move: "declare-attack", attackerId: objectId, targetIds: [objectId] },
  {
    move: "answer-decision",
    decisionId: grandArchiveDecisionId("decision-1"),
    stateVersion: 3,
    answer: true,
  },
] as const satisfies readonly GrandArchiveCommand[];

describe("Grand Archive command router", () => {
  it("routes every canonical command to its narrowed handler", () => {
    expect(commands.map((command) => command.move)).toEqual(GRAND_ARCHIVE_MOVE_NAMES);
    const playerId = grandArchivePlayerId("player-1");

    for (const command of commands) {
      expect(routeGrandArchiveCommand<RoutedCommand>(handlers, playerId, command)).toEqual({
        playerId,
        command,
      });
    }
  });

  it("keeps routing independent from runtime, state, and rules owners", () => {
    const source = readFileSync(join(import.meta.dirname, "command-router.ts"), "utf8");
    expect(source).toMatch(/from ["']\.\/commands\.ts["']/);
    expect(source).toMatch(/from ["']\.\.\/game\/identity\.ts["']/);
    expect(source).not.toMatch(/from ["']\.\/(?:runtime|model|rules)(?:\/|\.ts)/);
    expect(source).toMatch(/const exhaustiveCommand: never = command/);
  });

  it("owns production command dispatch instead of duplicating a runtime switch", () => {
    const runtimeSource = readFileSync(
      join(import.meta.dirname, "../procedures/game-flow/runtime.ts"),
      "utf8",
    );
    expect(runtimeSource).toContain("createGrandArchiveCommandHandlers(context)");
    expect(runtimeSource).toMatch(/routeGrandArchiveCommand\(/);
    expect(runtimeSource).not.toMatch(/switch \(command\.move\)/);
  });

  it("narrows handler payloads by move", () => {
    const attack: GrandArchiveCommandFor<"declare-attack"> = {
      move: "declare-attack",
      attackerId: grandArchiveObjectId("attacker-1"),
      targetIds: [grandArchiveObjectId("defender-1")],
    };
    expect(attack.targetIds).toHaveLength(1);
  });
});
