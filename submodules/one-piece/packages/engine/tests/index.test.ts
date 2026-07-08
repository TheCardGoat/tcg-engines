import { describe, expect, test } from "vite-plus/test";
import { applyPatches } from "immer";
import {
  applyCommand,
  createMatch,
  createSt01MirrorPracticeConfig,
  createTestMatchState,
  getLegalCommands,
  projectStateForSeat,
  replayMatch,
  ST01_MAIN_DECK,
  type CardRef,
  type EngineCommand,
  type MatchConfig,
  type MatchSeat,
  type MatchState,
} from "../src/index.ts";
import {
  getCard,
  op13GumGumGatlingGun021,
  op13Higuma013,
  op13Lilith113,
  op13MonkeyDLuffy001,
  op13Otama043,
  op13RoronoaZoro037,
  op13TonyTonyChopper030,
  op13WindmillVillage022,
} from "../../cards/src/index.ts";

function cardId(card: CardRef): string {
  return typeof card === "string" ? card : card.id;
}

function cardIds(cards: readonly CardRef[]): string[] {
  return cards.map(cardId);
}

const playerOneDeck = [
  op13GumGumGatlingGun021,
  op13WindmillVillage022,
  op13Otama043,
  op13TonyTonyChopper030,
  op13Higuma013,
  op13Otama043,
  op13WindmillVillage022,
  op13GumGumGatlingGun021,
  op13Higuma013,
  op13RoronoaZoro037,
];

const playerTwoDeck = [
  op13GumGumGatlingGun021,
  op13WindmillVillage022,
  op13Otama043,
  op13TonyTonyChopper030,
  op13Otama043,
  op13Otama043,
  op13WindmillVillage022,
  op13GumGumGatlingGun021,
  op13Higuma013,
  op13RoronoaZoro037,
];

function buildConfig(overrides: Partial<MatchConfig> = {}): MatchConfig {
  return {
    firstPlayer: "south",
    shuffleDecks: false,
    players: {
      south: {
        leaderCardId: op13MonkeyDLuffy001.id,
        mainDeck: cardIds(playerOneDeck),
      },
      north: {
        leaderCardId: op13MonkeyDLuffy001.id,
        mainDeck: cardIds(playerTwoDeck),
      },
    },
    ...overrides,
  };
}

function findCardInZone(
  state: MatchState,
  seat: MatchSeat,
  zone: "hand" | "life" | "trash" | "deck" | "character",
  card: CardRef,
): string {
  const targetCardId = cardId(card);
  const player = state.players[seat];
  const pool =
    zone === "character"
      ? player.characterArea.filter((entry): entry is string => Boolean(entry))
      : player[zone];
  const instanceId = pool.find((candidate) => state.cards[candidate]?.cardId === targetCardId);

  if (!instanceId) {
    throw new Error(`Could not find ${targetCardId} in ${seat} ${zone}`);
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

function startGameCommands(): EngineCommand[] {
  return [
    {
      type: "chooseJoKenPo",
      seat: "south",
      choice: "paper",
    },
    {
      type: "chooseJoKenPo",
      seat: "north",
      choice: "rock",
    },
    {
      type: "chooseFirstPlayer",
      seat: "south",
      firstPlayer: "south",
    },
    {
      type: "keepHand",
      seat: "south",
    },
    {
      type: "keepHand",
      seat: "north",
    },
    {
      type: "startGame",
      seat: "south",
    },
  ];
}

function resolveSetupTurnChoice(initial: MatchState): MatchState {
  return runCommands(initial, [
    {
      type: "chooseJoKenPo",
      seat: "south",
      choice: "paper",
    },
    {
      type: "chooseJoKenPo",
      seat: "north",
      choice: "rock",
    },
    {
      type: "chooseFirstPlayer",
      seat: "south",
      firstPlayer: "south",
    },
  ]);
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
  test("creates and projects ST-01 mirror practice", () => {
    expect(ST01_MAIN_DECK).toHaveLength(50);
    for (const cardId of ST01_MAIN_DECK) {
      expect(getCard(cardId).id).toBe(cardId);
    }

    const state = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));
    const view = projectStateForSeat(state, "south");

    expect(view.status).toBe("setup");
    expect(view.players.south.hand).toHaveLength(5);
  });

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
    expect(southView.logs.some((entry) => entry.message.includes("Cards drawn"))).toBe(true);
    expect(spectatorView.logs.some((entry) => entry.message.includes("Cards drawn"))).toBe(false);
  });

  test("supports accepting a mulligan and starts after both players choose", () => {
    const created = resolveSetupTurnChoice(createMatch(buildConfig()));
    const originalHand = [...created.players.south.hand];
    const mulliganed = applyCommand(created, {
      type: "mulligan",
      seat: "south",
    });
    const beforeNorthChoice = applyCommand(mulliganed.state, {
      type: "startGame",
      seat: "south",
    });
    const northKept = applyCommand(mulliganed.state, {
      type: "keepHand",
      seat: "north",
    });
    const started = applyCommand(northKept.state, {
      type: "startGame",
      seat: "south",
    });

    expect(mulliganed.accepted).toBe(true);
    expect(mulliganed.patches.length).toBeGreaterThan(0);
    expect(mulliganed.inversePatches.length).toBeGreaterThan(0);
    expect(mulliganed.state.setup.mulliganDecided.south).toBe(true);
    expect(mulliganed.state.setup.mulliganUsed.south).toBe(true);
    expect(mulliganed.state.players.south.hand).toHaveLength(5);
    expect(mulliganed.state.players.south.hand).not.toEqual(originalHand);
    expect(beforeNorthChoice.accepted).toBe(false);
    expect(beforeNorthChoice.reason).toBe(
      "Both players must choose whether to take a mulligan before starting.",
    );
    expect(northKept.accepted).toBe(true);
    expect(started.accepted).toBe(true);
    expect(started.state.status).toBe("active");
    expect(started.state.phase).toBe("main");
    expect(started.state.players.south.activeDon).toBe(2);
    expect(
      started.state.logHistory.some((entry) => entry.message.includes("enters DON!! phase")),
    ).toBe(true);
    expect(
      mulliganed.state.logHistory.filter(
        (entry) =>
          entry.message.includes("from Deck to Hand") ||
          entry.message.includes("from deck to hand"),
      ),
    ).toHaveLength(0);
    expect(
      mulliganed.state.logHistory.some((entry) =>
        entry.message.includes("accepted mulligan and redraws 5 cards"),
      ),
    ).toBe(true);
    expect(
      projectStateForSeat(mulliganed.state, "south").logs.some((entry) =>
        entry.message.includes("You accepted the mulligan and your new opening hand is:"),
      ),
    ).toBe(true);
  });

  test("supports refusing a mulligan without changing the opening hand", () => {
    const created = resolveSetupTurnChoice(createMatch(buildConfig()));
    const originalHand = [...created.players.south.hand];
    const kept = applyCommand(created, {
      type: "keepHand",
      seat: "south",
    });
    const secondChoice = applyCommand(kept.state, {
      type: "mulligan",
      seat: "south",
    });
    const southLegal = getLegalCommands(kept.state, "south");

    expect(kept.accepted).toBe(true);
    expect(kept.state.setup.mulliganDecided.south).toBe(true);
    expect(kept.state.setup.mulliganUsed.south).toBe(false);
    expect(kept.state.players.south.hand).toEqual(originalHand);
    expect(
      kept.state.logHistory.some((entry) => entry.message.includes("keeps their opening hand")),
    ).toBe(true);
    expect(
      projectStateForSeat(kept.state, "spectator").logs.some((entry) =>
        entry.message.includes("keeps their opening hand"),
      ),
    ).toBe(true);
    expect(secondChoice.accepted).toBe(false);
    expect(secondChoice.reason).toBe("This player already made a mulligan choice.");
    expect(southLegal.some((command) => command.type === "mulligan")).toBe(false);
    expect(southLegal.some((command) => command.type === "keepHand")).toBe(false);
  });

  test("resolves Jo Ken Po draw, winner, and first-player setup choice", () => {
    const created = createMatch(
      buildConfig({
        players: {
          south: {
            ...buildConfig().players.south,
            playerName: "You",
          },
          north: {
            ...buildConfig().players.north,
            playerName: "Practice Bot",
          },
        },
      }),
    );
    const drawnRound = runCommands(created, [
      {
        type: "chooseJoKenPo",
        seat: "south",
        choice: "rock",
      },
      {
        type: "chooseJoKenPo",
        seat: "north",
        choice: "rock",
      },
    ]);
    const wonRound = runCommands(drawnRound, [
      {
        type: "chooseJoKenPo",
        seat: "south",
        choice: "paper",
      },
      {
        type: "chooseJoKenPo",
        seat: "north",
        choice: "rock",
      },
    ]);
    const choseFirstPlayer = applyCommand(wonRound, {
      type: "chooseFirstPlayer",
      seat: "south",
      firstPlayer: "north",
    });

    expect(drawnRound.setup.joKenPo.round).toBe(2);
    expect(drawnRound.setup.joKenPo.winner).toBeNull();
    expect(
      drawnRound.logHistory.some((entry) =>
        entry.message.includes("In the 1st Jo Ken Po round it was a draw"),
      ),
    ).toBe(true);
    expect(wonRound.setup.joKenPo.winner).toBe("south");
    expect(
      wonRound.logHistory.some((entry) =>
        entry.message.includes(
          "In the 2nd Jo Ken Po round You won the Jo Ken Po and will decide who takes the first turn",
        ),
      ),
    ).toBe(true);
    expect(choseFirstPlayer.accepted).toBe(true);
    expect(choseFirstPlayer.state.config.firstPlayer).toBe("north");
    expect(choseFirstPlayer.state.activeSeat).toBe("north");
    expect(
      choseFirstPlayer.state.logHistory.some((entry) =>
        entry.message.includes("You decided that Practice Bot will take the first turn."),
      ),
    ).toBe(true);
  });

  test("keeps pending Jo Ken Po picks hidden until both players choose", () => {
    const created = createMatch(buildConfig());
    const firstPick = applyCommand(created, {
      type: "chooseJoKenPo",
      seat: "south",
      choice: "paper",
    });
    const firstPickPatchText = JSON.stringify(firstPick.patches);

    expect(firstPick.accepted).toBe(true);
    expect(firstPick.state.setup.joKenPo.pendingSeats).toEqual(["south"]);
    expect(firstPick.state.setup.joKenPo.hiddenChoices).toEqual({ south: "paper" });
    expect(firstPick.state.setup.joKenPo.choices).toEqual({});
    expect(firstPick.state.commandHistory.some((command) => command.type === "chooseJoKenPo")).toBe(
      false,
    );
    expect(firstPickPatchText).toContain("hiddenChoices");
    expect(getLegalCommands(firstPick.state, "south")).toHaveLength(0);
    expect(getLegalCommands(firstPick.state, "north").map((command) => command.type)).toEqual([
      "chooseJoKenPo",
      "chooseJoKenPo",
      "chooseJoKenPo",
    ]);

    const resolved = applyCommand(firstPick.state, {
      type: "chooseJoKenPo",
      seat: "north",
      choice: "rock",
    });

    expect(resolved.accepted).toBe(true);
    expect(resolved.state.setup.joKenPo.pendingSeats).toEqual([]);
    expect(resolved.state.setup.joKenPo.hiddenChoices).toEqual({});
    expect(resolved.state.setup.joKenPo.choices).toEqual({
      north: "rock",
      south: "paper",
    });
    expect(
      resolved.state.logHistory.some((entry) =>
        entry.message.includes("South: Paper. North: Rock."),
      ),
    ).toBe(true);
  });

  test("resolves Jo Ken Po after restoring a hidden first pick from a snapshot", () => {
    const firstPick = applyCommand(createMatch(buildConfig()), {
      type: "chooseJoKenPo",
      seat: "south",
      choice: "paper",
    });
    const restored = JSON.parse(JSON.stringify(firstPick.state)) as MatchState;
    const resolved = applyCommand(restored, {
      type: "chooseJoKenPo",
      seat: "north",
      choice: "rock",
    });

    expect(resolved.accepted).toBe(true);
    expect(resolved.state.setup.joKenPo.winner).toBe("south");
    expect(resolved.state.setup.joKenPo.pendingSeats).toEqual([]);
    expect(resolved.state.setup.joKenPo.hiddenChoices).toEqual({});
    expect(resolved.state.setup.joKenPo.choices).toEqual({
      north: "rock",
      south: "paper",
    });
  });

  test("resolves Jo Ken Po timeouts and logs the timeout reason", () => {
    const oneTimedOut = applyCommand(createMatch(buildConfig()), {
      type: "resolveJoKenPoTimeout",
      seat: "south",
      winner: "north",
      reason: "onePlayerTimedOut",
      elapsedMs: 30000,
      timedOutSeats: ["south"],
    });
    const bothTimedOut = applyCommand(createMatch(buildConfig()), {
      type: "resolveJoKenPoTimeout",
      seat: "south",
      winner: "south",
      reason: "bothPlayersTimedOut",
      elapsedMs: 30000,
      timedOutSeats: ["south", "north"],
    });
    const premature = applyCommand(createMatch(buildConfig()), {
      type: "resolveJoKenPoTimeout",
      seat: "south",
      winner: "south",
      reason: "bothPlayersTimedOut",
      elapsedMs: 29999,
      timedOutSeats: ["south", "north"],
    });

    expect(oneTimedOut.accepted).toBe(true);
    expect(oneTimedOut.state.setup.joKenPo.winner).toBe("north");
    expect(
      oneTimedOut.state.logHistory.some((entry) => entry.message.includes("exceeded 30 seconds")),
    ).toBe(true);
    expect(bothTimedOut.accepted).toBe(true);
    expect(bothTimedOut.state.setup.joKenPo.winner).toBe("south");
    expect(
      bothTimedOut.state.logHistory.some((entry) =>
        entry.message.includes("Both players exceeded 30 seconds"),
      ),
    ).toBe(true);
    expect(premature.accepted).toBe(false);
    expect(premature.reason).toBe("Jo Ken Po timeout requires 30 seconds to elapse.");
  });

  test("omits spent mulligans and judge-invalid prompt commands from legal actions", () => {
    const created = resolveSetupTurnChoice(createMatch(buildConfig()));
    const afterMulligan = applyCommand(created, {
      type: "mulligan",
      seat: "south",
    }).state;
    const southLegal = getLegalCommands(afterMulligan, "south");

    expect(southLegal.some((command) => command.type === "mulligan")).toBe(false);
    expect(southLegal.some((command) => command.type === "keepHand")).toBe(false);

    const started = runCommands(createMatch(buildConfig()), startGameCommands());
    const stageId = findCardInZone(started, "south", "hand", op13WindmillVillage022);
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
    const created = runCommands(createMatch(buildConfig()), [
      {
        type: "chooseJoKenPo",
        seat: "south",
        choice: "paper",
      },
      {
        type: "chooseJoKenPo",
        seat: "north",
        choice: "rock",
      },
      {
        type: "chooseFirstPlayer",
        seat: "south",
        firstPlayer: "south",
      },
      {
        type: "keepHand",
        seat: "south",
      },
      {
        type: "keepHand",
        seat: "north",
      },
    ]);
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
    const started = runCommands(createMatch(buildConfig()), startGameCommands());
    const eventId = findCardInZone(started, "south", "hand", op13GumGumGatlingGun021);
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
    expect(
      result.logs.some((entry) =>
        entry.message.includes("Gum-Gum Gatling Gun gives 1 DON!! to Monkey.D.Luffy"),
      ),
    ).toBe(true);
  });

  test("rejecting an invalid playCard leaves DON and zones unchanged", () => {
    const started = runCommands(createMatch(buildConfig()), startGameCommands());
    const characterId = findCardInZone(started, "south", "hand", op13Otama043);
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
    const started = runCommands(createMatch(buildConfig()), startGameCommands());
    const otamaId = findCardInZone(started, "south", "hand", op13Otama043);
    const afterOtama = applyCommand(started, {
      type: "playCard",
      seat: "south",
      instanceId: otamaId,
      slotIndex: 0,
    }).state;
    const stageId = findCardInZone(afterOtama, "south", "hand", op13WindmillVillage022);
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
      stage: op13WindmillVillage022,
      character: [op13Otama043, op13Otama043],
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
    const started = runCommands(createMatch(buildConfig()), startGameCommands());
    const higumaId = findCardInZone(started, "south", "hand", op13Higuma013);
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
    const attackerId = findCardInZone(southTurn, "south", "character", op13Higuma013);
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

    const northOtama = findCardInZone(attacked.state, "north", "hand", op13Otama043);
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
          leaderCardId: op13MonkeyDLuffy001.id,
          mainDeck: cardIds([
            op13GumGumGatlingGun021,
            op13WindmillVillage022,
            op13Otama043,
            op13TonyTonyChopper030,
            op13Higuma013,
            op13GumGumGatlingGun021,
            op13WindmillVillage022,
            op13GumGumGatlingGun021,
            op13Higuma013,
            op13RoronoaZoro037,
          ]),
        },
      },
    });
    const started = runCommands(createMatch(config), startGameCommands());
    const higumaId = findCardInZone(started, "south", "hand", op13Higuma013);
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
    const attackerId = findCardInZone(southTurn, "south", "character", op13Higuma013);
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
        type: "chooseJoKenPo",
        seat: "south",
        choice: "paper",
      },
      {
        type: "chooseJoKenPo",
        seat: "north",
        choice: "rock",
      },
      {
        type: "chooseFirstPlayer",
        seat: "south",
        firstPlayer: "south",
      },
      {
        type: "keepHand",
        seat: "south",
      },
      {
        type: "keepHand",
        seat: "north",
      },
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
          leaderCardId: op13MonkeyDLuffy001.id,
          mainDeck: cardIds([
            op13Otama043,
            op13WindmillVillage022,
            op13GumGumGatlingGun021,
            op13Higuma013,
            op13Lilith113,
            op13RoronoaZoro037,
            op13GumGumGatlingGun021,
            op13WindmillVillage022,
            op13Otama043,
            op13Higuma013,
          ]),
        },
        north: buildConfig().players.north,
      },
    });
    const started = runCommands(createMatch(config), startGameCommands());
    const unsupportedId = findCardInZone(started, "south", "hand", op13Lilith113);
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
