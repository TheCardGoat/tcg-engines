import { describe, expect, test } from "vite-plus/test";
import { applyPatches } from "immer";
import {
  applyCommand,
  createMatch,
  createTestMatchState,
  getLegalCommands,
  projectStateForSeat,
  replayMatch,
  type EngineCommand,
  type MatchConfig,
  type MatchSeat,
  type MatchState,
} from "../src/index.ts";

function buildConfig(overrides: Partial<MatchConfig> = {}): MatchConfig {
  return {
    firstPlayer: "south",
    shuffleDecks: false,
    players: {
      south: {
        leaderCardId: "OP13-001",
        mainDeck: [
          "OP13-021",
          "OP13-022",
          "OP13-043",
          "OP13-030",
          "OP13-013",
          "OP13-043",
          "OP13-022",
          "OP13-021",
          "OP13-013",
          "OP13-037",
        ],
      },
      north: {
        leaderCardId: "OP13-001",
        mainDeck: [
          "OP13-021",
          "OP13-022",
          "OP13-043",
          "OP13-030",
          "OP13-043",
          "OP13-013",
          "OP13-022",
          "OP13-021",
          "OP13-013",
          "OP13-037",
        ],
      },
    },
    ...overrides,
  };
}

function findCardInZone(
  state: MatchState,
  seat: MatchSeat,
  zone: "hand" | "life" | "trash" | "deck" | "character",
  cardId: string,
): string {
  const player = state.players[seat];
  const pool =
    zone === "character"
      ? player.characterArea.filter((entry): entry is string => Boolean(entry))
      : player[zone];
  const instanceId = pool.find((candidate) => state.cards[candidate]?.cardId === cardId);

  if (!instanceId) {
    throw new Error(`Could not find ${cardId} in ${seat} ${zone}`);
  }

  return instanceId;
}

function runCommands(initial: MatchState, commands: EngineCommand[]): MatchState {
  let state = initial;
  for (const command of commands) {
    const result = applyCommand(state, command);
    expect(result.accepted).toBe(true);
    state = result.state;
  }
  return state;
}

function findPendingPromptByIntent(state: MatchState, intent: string) {
  return state.promptQueue.find(
    (prompt) =>
      prompt.kind === "choice" &&
      prompt.status === "pending" &&
      prompt.resolutionContext?.intent === intent,
  );
}

describe("@tcg/op-engine", () => {
  test("creates a match with filtered player views and opening logs", () => {
    const state = createMatch(buildConfig());
    const southView = projectStateForSeat(state, "south");
    const spectatorView = projectStateForSeat(state, "spectator");
    const judgeView = projectStateForSeat(state, "judge");

    expect(southView.status).toBe("setup");
    expect(southView.players.south.hand).toHaveLength(5);
    expect(southView.players.north.hand.every((card) => card.hidden)).toBe(true);
    expect(spectatorView.players.north.hand.every((card) => card.instanceId === null)).toBe(true);
    expect(spectatorView.players.south.hand.every((card) => card.instanceId === null)).toBe(true);
    expect(judgeView.players.north.hand.every((card) => card.name !== null)).toBe(true);
    expect(southView.decisions.find((decision) => decision.kind === "chooseAction")).toMatchObject({
      id: "actions:south",
      submit: {
        payloadSchemaVersion: 1,
      },
    });
    expect(spectatorView.decisions).toEqual([]);
    expect(southView.logs.some((entry) => entry.message.includes("opening hand"))).toBe(true);
    expect(spectatorView.logs.some((entry) => entry.message.includes("opening hand"))).toBe(false);
  });

  test("supports mulligan and starts the match with automatic DON!! setup", () => {
    const created = createMatch(buildConfig());
    const mulliganed = applyCommand(created, {
      type: "mulligan",
      seat: "south",
    });
    const started = applyCommand(mulliganed.state, {
      type: "startGame",
      seat: "south",
    });

    expect(mulliganed.accepted).toBe(true);
    expect(mulliganed.patches.length).toBeGreaterThan(0);
    expect(mulliganed.inversePatches.length).toBeGreaterThan(0);
    expect(started.accepted).toBe(true);
    expect(started.state.status).toBe("active");
    expect(started.state.phase).toBe("main");
    expect(started.state.players.south.activeDon).toBe(2);
    expect(
      started.state.logHistory.some((entry) => entry.message.includes("enters DON!! phase")),
    ).toBe(true);
  });

  test("omits spent mulligans and judge-invalid prompt commands from legal actions", () => {
    const created = createMatch(buildConfig());
    const afterMulligan = applyCommand(created, {
      type: "mulligan",
      seat: "south",
    }).state;
    const southLegal = getLegalCommands(afterMulligan, "south");

    expect(southLegal.some((command) => command.type === "mulligan")).toBe(false);

    const started = runCommands(createMatch(buildConfig()), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const stageId = findCardInZone(started, "south", "hand", "OP13-022");
    const afterStage = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: stageId,
    }).state;
    const activated = applyCommand(afterStage, {
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: afterStage.players.south.stageArea!,
      trigger: "activateMain",
    }).state;
    const judgeLegal = getLegalCommands(activated, "judge");

    expect(judgeLegal.some((command) => command.type === "resolvePrompt")).toBe(false);
    expect(judgeLegal.some((command) => command.type === "judgeResolvePrompt")).toBe(true);
  });

  test("returns reversible patches for each state transition", () => {
    const created = createMatch(buildConfig());
    const result = applyCommand(created, {
      type: "startGame",
      seat: "south",
    });
    const rolledBack = applyPatches(result.state, result.inversePatches);

    expect(result.accepted).toBe(true);
    expect(result.patches.length).toBeGreaterThan(0);
    expect(result.inversePatches.length).toBeGreaterThan(0);
    expect(rolledBack).toEqual(created);
  });

  test("resolves a main event through the structured card DSL and logs it", () => {
    const started = runCommands(createMatch(buildConfig()), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const eventId = findCardInZone(started, "south", "hand", "OP13-021");
    const result = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: eventId,
    });

    expect(result.accepted).toBe(true);
    expect(result.state.players.south.restedDon).toBe(0);
    expect(result.state.cards[result.state.players.south.leaderInstanceId].attachedDon).toBe(1);
    expect(result.state.players.south.trash.some((instanceId) => instanceId === eventId)).toBe(
      true,
    );
    expect(result.logs.some((entry) => entry.message.includes("plays Gum-Gum Gatling Gun"))).toBe(
      true,
    );
  });

  test("rejecting an invalid playCard leaves DON and zones unchanged", () => {
    const started = runCommands(createMatch(buildConfig()), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const characterId = findCardInZone(started, "south", "hand", "OP13-043");
    const beforeActiveDon = started.players.south.activeDon;
    const beforeRestedDon = started.players.south.restedDon;
    const result = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: characterId,
      slotIndex: 99,
    });

    expect(result.accepted).toBe(false);
    expect(result.state.players.south.activeDon).toBe(beforeActiveDon);
    expect(result.state.players.south.restedDon).toBe(beforeRestedDon);
    expect(result.state.players.south.hand).toContain(characterId);
    expect(result.state.players.south.characterArea.every((entry) => entry !== characterId)).toBe(
      true,
    );
  });

  test("plays a stage, activates it, and projects the modified character power", () => {
    const started = runCommands(createMatch(buildConfig()), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const otamaId = findCardInZone(started, "south", "hand", "OP13-043");
    const afterOtama = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: otamaId,
      slotIndex: 0,
    }).state;
    const stageId = findCardInZone(afterOtama, "south", "hand", "OP13-022");
    const afterStage = applyCommand(afterOtama, {
      type: "playCard",
      seat: "south",
      instanceId: stageId,
    }).state;
    const activated = applyCommand(afterStage, {
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: afterStage.players.south.stageArea!,
      trigger: "activateMain",
    });
    const optionalPrompt = findPendingPromptByIntent(activated.state, "effectOptional");
    const confirmed = applyCommand(activated.state, {
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });
    const targetPrompt = findPendingPromptByIntent(confirmed.state, "effectTargetSelection");
    const resolved = targetPrompt
      ? applyCommand(confirmed.state, {
          type: "resolvePrompt",
          seat: "south",
          promptId: targetPrompt.id,
          selectedIds: [confirmed.state.players.south.characterArea[0]!],
        })
      : confirmed;
    const southView = projectStateForSeat(resolved.state, "south");

    expect(activated.accepted).toBe(true);
    expect(optionalPrompt).toBeDefined();
    expect(resolved.state.cards[resolved.state.players.south.stageArea!].rested).toBe(true);
    expect(southView.players.south.characters[0]?.power).toBe(1000);
  });

  test("projects prompt decisions with confirm and filtered target metadata", () => {
    const state = createTestMatchState({
      stage: "OP13-022",
      character: ["OP13-043", "OP13-043"],
    });
    const activated = applyCommand(state, {
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: state.players.south.stageArea!,
      trigger: "activateMain",
    });
    const optionalPrompt = findPendingPromptByIntent(activated.state, "effectOptional");
    const optionalDecision = projectStateForSeat(activated.state, "south").decisions.find(
      (decision) => decision.id === optionalPrompt?.id,
    );

    expect(optionalDecision).toMatchObject({
      kind: "confirm",
      submit: {
        commandType: "resolvePrompt",
        payloadSchemaVersion: 1,
        promptId: optionalPrompt?.id,
      },
    });
    expect(optionalDecision?.steps[0]?.kind).toBe("confirm");

    const confirmed = applyCommand(activated.state, {
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });
    const targetPrompt = findPendingPromptByIntent(confirmed.state, "effectTargetSelection");
    const targetDecision = projectStateForSeat(confirmed.state, "south").decisions.find(
      (decision) => decision.id === targetPrompt?.id,
    );
    const targetStep = targetDecision?.steps[0];

    expect(targetPrompt).toBeDefined();
    expect(targetDecision).toMatchObject({
      kind: "selectTargets",
      currentStepId: `${targetPrompt!.id}:selectTargets`,
      submit: {
        commandType: "resolvePrompt",
        payloadSchemaVersion: 1,
        promptId: targetPrompt!.id,
      },
      extensions: {
        resolutionIntent: "effectTargetSelection",
      },
    });
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected a selectEntity target step.");
    }
    expect(targetStep.role).toBe("target");
    expect(targetStep.min).toBe(1);
    expect(targetStep.candidates).toHaveLength(2);
    expect(targetStep.uiHints?.highlightZones).toEqual(["character"]);
    expect(targetStep.constraints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "player", value: "self" }),
        expect.objectContaining({ id: "zones" }),
        expect.objectContaining({ id: "basePower", operator: "lte", value: 2000 }),
      ]),
    );
  });

  test("runs attack, counter, damage prevention, and trigger prompting", () => {
    const started = runCommands(createMatch(buildConfig()), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const higumaId = findCardInZone(started, "south", "hand", "OP13-013");
    const afterPlay = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: higumaId,
      slotIndex: 0,
    }).state;
    const northTurn = applyCommand(afterPlay, {
      type: "endTurn",
      seat: "south",
    }).state;
    const southTurn = applyCommand(northTurn, {
      type: "endTurn",
      seat: "north",
    }).state;
    const attackerId = findCardInZone(southTurn, "south", "character", "OP13-013");
    const withDon = runCommands(southTurn, [
      {
        type: "attachDon",
        seat: "south",
        targetId: attackerId,
        amount: 3,
      },
    ]);
    const attacked = applyCommand(withDon, {
      type: "declareAttack",
      seat: "south",
      attackerId,
      targetId: withDon.players.north.leaderInstanceId,
    });
    const counterPrompt = findPendingPromptByIntent(attacked.state, "battleCounter");

    expect(attacked.accepted).toBe(true);
    expect(counterPrompt).toBeDefined();

    const northOtama = findCardInZone(attacked.state, "north", "hand", "OP13-043");
    const afterCounter = applyCommand(attacked.state, {
      type: "resolvePrompt",
      seat: "north",
      promptId: counterPrompt!.id,
      selectedIds: [northOtama],
    });

    expect(afterCounter.accepted).toBe(true);
    expect(afterCounter.state.players.north.life).toHaveLength(4);
    expect(afterCounter.logs.some((entry) => entry.message.includes("does not deal damage"))).toBe(
      true,
    );
  });

  test("creates trigger prompts from life damage and can resolve them", () => {
    const config = buildConfig({
      players: {
        south: buildConfig().players.south,
        north: {
          leaderCardId: "OP13-001",
          mainDeck: [
            "OP13-021",
            "OP13-022",
            "OP13-043",
            "OP13-030",
            "OP13-013",
            "OP13-013",
            "OP13-022",
            "OP13-021",
            "OP13-013",
            "OP13-037",
          ],
        },
      },
    });
    const started = runCommands(createMatch(config), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const higumaId = findCardInZone(started, "south", "hand", "OP13-013");
    const afterPlay = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: higumaId,
      slotIndex: 0,
    }).state;
    const northTurn = applyCommand(afterPlay, {
      type: "endTurn",
      seat: "south",
    }).state;
    const southTurn = applyCommand(northTurn, {
      type: "endTurn",
      seat: "north",
    }).state;
    const attackerId = findCardInZone(southTurn, "south", "character", "OP13-013");
    const withDon = applyCommand(southTurn, {
      type: "attachDon",
      seat: "south",
      targetId: attackerId,
      amount: 3,
    }).state;
    const attacked = applyCommand(withDon, {
      type: "declareAttack",
      seat: "south",
      attackerId,
      targetId: withDon.players.north.leaderInstanceId,
    });
    const counterPrompt = findPendingPromptByIntent(attacked.state, "battleCounter");
    const resolvedCounter = applyCommand(attacked.state, {
      type: "resolvePrompt",
      seat: "north",
      promptId: counterPrompt!.id,
      selectedIds: [],
    });
    const triggerPrompt = findPendingPromptByIntent(resolvedCounter.state, "lifeTrigger");
    const resolvedTrigger = applyCommand(resolvedCounter.state, {
      type: "resolvePrompt",
      seat: "north",
      promptId: triggerPrompt!.id,
      optionId: "no",
    });

    expect(triggerPrompt).toBeDefined();
    expect(resolvedCounter.state.players.north.life).toHaveLength(3);
    expect(resolvedTrigger.accepted).toBe(true);
  });

  test("replay is deterministic for logs and state", () => {
    const commands: EngineCommand[] = [
      {
        type: "startGame",
        seat: "south",
      },
      {
        type: "playCard",
        seat: "south",
        instanceId: createMatch(buildConfig()).players.south.hand[0]!,
        slotIndex: 0,
      },
    ];

    const first = replayMatch(buildConfig(), commands);
    const second = replayMatch(buildConfig(), commands);

    expect(first.state.logHistory).toEqual(second.state.logHistory);
    expect(first.state.eventHistory).toEqual(second.state.eventHistory);
  });

  test("records capability issues for unsupported semantics", () => {
    const config = buildConfig({
      players: {
        south: {
          leaderCardId: "OP13-001",
          mainDeck: [
            "OP13-043",
            "OP13-022",
            "OP13-021",
            "OP13-013",
            "OP13-037",
            "OP13-113",
            "OP13-021",
            "OP13-022",
            "OP13-043",
            "OP13-013",
          ],
        },
        north: buildConfig().players.north,
      },
    });
    const started = runCommands(createMatch(config), [
      {
        type: "startGame",
        seat: "south",
      },
    ]);
    const unsupportedId = findCardInZone(started, "south", "hand", "OP13-113");
    const result = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: unsupportedId,
      slotIndex: 0,
    });

    expect(result.accepted).toBe(true);
    expect(result.capabilityIssues.some((issue) => issue.kind === "unsupportedAction")).toBe(true);
    expect(result.state.promptQueue.some((prompt) => prompt.seat === "judge")).toBe(true);
  });

  test("rejects transitions that violate state invariants", () => {
    const created = createMatch(buildConfig());
    const broken = structuredClone(created) as MatchState;
    const duplicated = broken.players.south.hand[0]!;
    broken.players.south.hand.push(duplicated);

    const result = applyCommand(broken, {
      type: "startGame",
      seat: "south",
    });

    expect(result.accepted).toBe(false);
    expect(result.reason).toContain("Engine invariant violation");
    expect(result.capabilityIssues.some((issue) => issue.kind === "invariantViolation")).toBe(true);
  });

  test("reports missing instance references as invariant failures instead of throwing", () => {
    const created = createMatch(buildConfig());
    const broken = structuredClone(created) as MatchState;
    const missing = broken.players.south.hand[0]!;
    delete broken.cards[missing];

    const result = applyCommand(broken, {
      type: "startGame",
      seat: "south",
    });

    expect(result.accepted).toBe(false);
    expect(result.reason).toContain("Engine invariant violation");
    expect(result.reason).toContain(`Instance ${missing} in south hand`);
  });
});
