import { describe, expect, it } from "vite-plus/test";
import { fyendalSSpringTunic } from "../../../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { listLegalCommands } from "../../rules/legal-commands/index.ts";
import type { FabLegalCommand } from "../../rules/legal-commands/index.ts";
import { dispatchTestCommand } from "../../testing/test-command.ts";

function energyCount(game: FabTestEngine, tunicId: string): number {
  return (
    game
      .getState()
      .objects[tunicId]?.counters.find(
        (counter) => counter.kind === "named" && counter.name === "energy",
      )?.count ?? 0
  );
}

function createTunicGame(): FabTestEngine {
  return FabTestEngine.start(
    { hero: bravo, chest: [fyendalSSpringTunic], hand: [], actionPoints: 1, deck: 10 },
    { hero: dash, hand: [], deck: 10 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

function advanceToTunicDecision(game: FabTestEngine): {
  readonly ownerId: string;
  readonly tunicId: string;
  readonly commands: readonly FabLegalCommand[];
} {
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);
  Bravo.endTurn();
  game.untilIdle({ optionals: "decline" });
  Dash.endTurn();
  for (let pass = 0; pass < 8 && !game.getState().decision; pass += 1) game.passBoth();
  const decision = game.getState().decision;
  expect(decision).toMatchObject({ kind: "boolean", actorId: Bravo.id });
  return {
    ownerId: Bravo.id,
    tunicId: Bravo.card(fyendalSSpringTunic),
    commands: listLegalCommands(game.getRuntime(), Bravo.id).filter(
      (command) => command.move === "set-optional-trigger-automation",
    ),
  };
}

function commandForMode(
  commands: readonly FabLegalCommand[],
  mode: "auto-accept" | "auto-decline",
) {
  const command = commands.find((candidate) => candidate.payload.mode === mode);
  expect(command).toBeDefined();
  return command!;
}

describe("set-optional-trigger-automation during an active prompt", () => {
  it.each([
    { mode: "auto-accept" as const, expectedEnergy: 1 },
    { mode: "auto-decline" as const, expectedEnergy: 0 },
  ])(
    "$mode answers the current Tunic prompt and automates the next trigger",
    ({ mode, expectedEnergy }) => {
      const game = createTunicGame();
      const { ownerId, tunicId, commands } = advanceToTunicDecision(game);
      expect(commands.map((command) => command.payload.mode)).toEqual([
        "auto-accept",
        "auto-decline",
      ]);

      const result = game.as(bravo).exec(commandForMode(commands, mode));

      expect(result).toMatchObject({ accepted: true });
      expect(game.getState().decision).toBeNull();
      expect(game.getState().optionalTriggerAutomation[ownerId]?.[tunicId]).toBe(mode);
      expect(energyCount(game, tunicId)).toBe(expectedEnergy);

      game.untilIdle({ optionals: "decline" });
      game.as(bravo).endTurn();
      game.untilIdle({ optionals: "decline" });
      game.as(dash).endTurn();
      game.untilIdle({ optionals: "decline" });
      expect(game.getState().decision).toBeNull();
      expect(energyCount(game, tunicId)).toBe(expectedEnergy * 2);
    },
  );

  it.each([
    { name: "stale decision id", change: { decisionId: "decision-999" } },
    { name: "stale state version", change: { stateVersion: 999_999 } },
  ])("rejects a $name without saving or answering", ({ change }) => {
    const game = createTunicGame();
    const { ownerId, tunicId, commands } = advanceToTunicDecision(game);
    const command = commandForMode(commands, "auto-accept");
    const beforeDecision = game.getState().decision;
    const result = dispatchTestCommand(
      game.getRuntime(),
      "set-optional-trigger-automation",
      ownerId,
      {
        ...command.payload,
        decision: { ...(command.payload.decision as object), ...change },
      },
    );

    expect(result).toMatchObject({ accepted: false });
    expect(game.getState().decision).toEqual(beforeDecision);
    expect(game.getState().optionalTriggerAutomation[ownerId]?.[tunicId]).toBeUndefined();
    expect(energyCount(game, tunicId)).toBe(0);
  });
});

describe("opponent trigger yield configuration", () => {
  it("saves Fyendal's Spring Tunic and yields the same legal response window", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], actionPoints: 1, deck: 10 },
      { hero: dash, chest: [fyendalSSpringTunic], hand: [], deck: 10 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const tunicId = Dash.card(fyendalSSpringTunic);
    Bravo.endTurn();
    for (let step = 0; step < 8; step += 1) {
      if (
        game.getState().rulesStack.at(-1)?.source.instanceId === tunicId &&
        game.getPriorityPlayerId() === Bravo.id
      )
        break;
      const decision = game.getState().decision;
      if (decision?.kind === "boolean") {
        game.as(dash).exec({
          move: "answer-decision",
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
      } else {
        const holder = game.getPriorityPlayerId();
        if (holder) game.pass(holder);
      }
    }
    expect(game.getPriorityPlayerId()).toBe(Bravo.id);
    const command = listLegalCommands(game.getRuntime(), Bravo.id).find(
      (candidate) =>
        candidate.payload.addOpponentTriggerYieldCardId === fyendalSSpringTunic.canonicalId,
    );
    expect(command).toMatchObject({ sourceInstanceId: tunicId });

    const result = game.as(bravo).exec(command!);

    expect(result).toMatchObject({ accepted: true });
    expect(game.getState().automationPreferences[Bravo.id]?.opponentTriggerYieldCardIds).toContain(
      fyendalSSpringTunic.canonicalId,
    );
    expect(game.getPriorityPlayerId()).not.toBe(Bravo.id);

    game.untilIdle({ optionals: "decline" });
    expect(game.getPriorityPlayerId()).toBe(Dash.id);
    game.as(dash).pass();
    expect(game.getPriorityPlayerId()).toBe(Bravo.id);
    const remove = listLegalCommands(game.getRuntime(), Bravo.id).find(
      (candidate) =>
        candidate.payload.removeOpponentTriggerYieldCardId === fyendalSSpringTunic.canonicalId,
    );
    expect(remove).toBeDefined();
    expect(game.as(bravo).exec(remove!)).toMatchObject({ accepted: true });
    expect(
      game.getState().automationPreferences[Bravo.id]?.opponentTriggerYieldCardIds,
    ).not.toContain(fyendalSSpringTunic.canonicalId);
  });
});
