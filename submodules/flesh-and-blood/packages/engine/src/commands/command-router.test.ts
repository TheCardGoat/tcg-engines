import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FAB_MOVE_NAMES, type FabCommand } from "../moves.ts";
import { routeFabCommand, type FabCommandHandlers, type FabCommandFor } from "./command-router.ts";

type RoutedCommand = {
  readonly actorId: string;
  readonly command: FabCommand;
};

const handlers = {
  "begin-play": (actorId, command) => ({ actorId, command }),
  "set-optional-trigger-automation": (actorId, command) => ({ actorId, command }),
  "set-automation-preferences": (actorId, command) => ({ actorId, command }),
  "arm-priority-hold": (actorId, command) => ({ actorId, command }),
  "answer-decision": (actorId, command) => ({ actorId, command }),
  activate: (actorId, command) => ({ actorId, command }),
  defend: (actorId, command) => ({ actorId, command }),
  pass: (actorId, command) => ({ actorId, command }),
  "end-turn": (actorId, command) => ({ actorId, command }),
  concede: (actorId, command) => ({ actorId, command }),
} satisfies FabCommandHandlers<RoutedCommand>;

const commands = [
  { move: "begin-play", instanceId: "card-1" },
  { move: "set-optional-trigger-automation", instanceId: "equipment-1", mode: "auto-decline" },
  { move: "set-automation-preferences", preferences: { priorityMode: "auto-pass" } },
  { move: "arm-priority-hold" },
  { move: "answer-decision", decisionId: "decision-1", stateVersion: 3, answer: true },
  { move: "activate", instanceId: "equipment-1" },
  { move: "defend", instanceIds: ["defender-1"] },
  { move: "pass" },
  { move: "end-turn" },
  { move: "concede" },
] as const satisfies readonly FabCommand[];

describe("FAB command router", () => {
  it("routes every canonical command to its narrowed handler", () => {
    expect(commands.map((command) => command.move)).toEqual(FAB_MOVE_NAMES);

    for (const command of commands) {
      expect(routeFabCommand<RoutedCommand>(handlers, "player-1", command)).toEqual({
        actorId: "player-1",
        command,
      });
    }
  });

  it("keeps routing independent from runtime, state, and rules owners", () => {
    const source = readFileSync(join(import.meta.dirname, "command-router.ts"), "utf8");
    expect(source).toMatch(/from ["']\.\.\/moves\.ts["']/);
    expect(source).not.toMatch(/from ["']\.\.\/(?:runtime|state|rules)(?:\/|\.ts)/);
    expect(source).toMatch(/const exhaustiveCommand: never = command/);
  });

  it("owns production command dispatch instead of duplicating a runtime switch", () => {
    const runtimeSource = readFileSync(join(import.meta.dirname, "../runtime.ts"), "utf8");
    expect(runtimeSource).toMatch(/routeFabCommand<FabCommandHandlerResult>/);
    expect(runtimeSource).not.toMatch(/switch \(command\.move\)/);
  });

  it("narrows handler payloads by move", () => {
    const defend: FabCommandFor<"defend"> = {
      move: "defend",
      instanceIds: ["defender-1"],
    };
    expect(defend.instanceIds).toEqual(["defender-1"]);
  });
});
