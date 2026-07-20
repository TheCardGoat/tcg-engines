import {
  applyCommand,
  getLegalCommands,
  getSafeOnePieceAutomatedActionStrategyOption,
  projectStateForSeat,
  resolveBotPromptCommand,
} from "@tcg/op-engine";
import type {
  CardZone,
  EngineCommand,
  GameLogEntry,
  EngineAnimation,
  JudgeCommand,
  MatchSeat,
  MatchState,
} from "@tcg/op-engine";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import { createCanonicalEngineMoveLog, createEngineLogMessage } from "@tcg/shared/game-engine";
import type {
  AcceptedMoveRecord,
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  PacketAnimation,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import { createRandomAPI } from "@tcg/engine-core";
import { validateInteractionSubmission } from "@tcg/protocol";
import { buildOnePieceInteractionView, onePieceSubmissionToPayload } from "./interaction-protocol";

export class OnePieceServerEngine implements ServerGameEngine {
  constructor(
    public state: MatchState,
    public readonly playerIdToSeat: Record<string, MatchSeat>,
  ) {}

  get seatToPlayerId(): Record<MatchSeat, string> {
    const map: Partial<Record<MatchSeat, string>> = {};
    for (const [playerId, seat] of Object.entries(this.playerIdToSeat)) {
      map[seat] = playerId;
    }
    return map as Record<MatchSeat, string>;
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    const seat = this.playerIdToSeat[actorId];
    if (!seat) {
      return {
        success: false,
        error: `Unknown actor: ${actorId}`,
        errorCode: "INVALID_ARGUMENTS",
        stateID: this.getStateID(),
      };
    }
    if (isJudgeOnlyMove(moveType)) {
      return {
        success: false,
        error: `Judge-only move is not available to player actors: ${moveType}`,
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      };
    }

    const command = buildEngineCommand(moveType, seat, payload);
    if (!command) {
      return {
        success: false,
        error: `Unknown move type: ${moveType}`,
        errorCode: "UNKNOWN_MOVE",
        stateID: this.getStateID(),
      };
    }

    const result = applyCommand(this.state, command);
    if (!result.accepted) {
      return {
        success: false,
        error: result.reason ?? "Command rejected",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      };
    }

    this.state = result.state;
    const stateVersion = this.getStateID();
    const timestamp = Date.now();
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion,
      turnNumber: result.state.turnNumber,
      actorId,
      moveId: moveType,
      input: { args: redactHiddenSetupPayload(moveType, payload) },
      processedCommand: redactHiddenSetupCommand(command),
      timestamp,
      sourceAuthority: context.sourceAuthority,
      newStateID: stateVersion,
      transitionType: "move",
    };

    const engineLogRecords: EngineLogRecord[] = result.logs.map((log) => ({
      gameId: context.gameId,
      stateVersion,
      timestamp,
      sourceAuthority: context.sourceAuthority,
      log: toCanonicalOnePieceMoveLog(log, command.type, this.seatToPlayerId, timestamp),
    }));

    return {
      success: true,
      stateID: stateVersion,
      state: redactHiddenSetupState(result.state),
      patches: redactHiddenSetupPatches(result.patches),
      animations: result.animations.map(onePiecePacketAnimation),
      acceptedMoveRecord,
      engineLogRecords,
    };
  }

  getStateID(): number {
    return this.state.idCounter;
  }

  getState(): unknown {
    return this.state;
  }

  getActivePlayerId(): string | undefined {
    const pendingPrompt = this.state.promptQueue.find((prompt) => prompt.status === "pending");
    if (pendingPrompt) {
      return pendingPrompt.seat === "judge" ? undefined : this.seatToPlayerId[pendingPrompt.seat];
    }
    return this.seatToPlayerId[this.state.activeSeat];
  }

  hasGameEnded(): boolean {
    return this.state.status === "finished";
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    if (!this.hasGameEnded()) return undefined;
    return {
      winnerId: this.state.winner ? this.seatToPlayerId[this.state.winner] : undefined,
    };
  }

  getInteractionView(actorId: string): EngineInteractionView {
    const seat = this.playerIdToSeat[actorId] ?? "spectator";
    const playerView = projectStateForSeat(this.state, seat);
    return buildOnePieceInteractionView({
      actorId,
      seat,
      stateVersion: this.getStateID(),
      playerView,
    });
  }

  getInteractionActorIds(): readonly string[] {
    return Object.keys(this.playerIdToSeat);
  }

  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const pendingPrompt = this.state.promptQueue.find((prompt) => prompt.status === "pending");
    if (pendingPrompt?.seat === "judge") {
      return {
        finalResult: {
          success: false,
          error: "Judge prompt requires judge authority.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "judge-prompt" },
      };
    }
    const setupSeat =
      this.state.status === "setup"
        ? (["south", "north"] as const).find(
            (seat) => getLegalCommands(this.state, seat).length > 0,
          )
        : undefined;
    const actionSeat = pendingPrompt?.seat ?? setupSeat ?? this.state.activeSeat;
    const actorId = this.seatToPlayerId[actionSeat];
    if (!actorId) {
      return {
        finalResult: {
          success: false,
          error: "One Piece has no active bot actor.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "no-active-actor" },
      };
    }
    const seat = this.playerIdToSeat[actorId];
    if (!seat) {
      return {
        finalResult: {
          success: false,
          error: `Unknown bot actor: ${actorId}`,
          errorCode: "INVALID_ARGUMENTS",
          stateID: this.getStateID(),
        },
        blocked: { reason: "unknown-actor" },
      };
    }

    const strategyOption = getSafeOnePieceAutomatedActionStrategyOption(options.strategyId);
    const random = createRandomAPI(`${context.gameId}:${this.getStateID()}:${seat}`);
    const command = pendingPrompt
      ? resolveBotPromptCommand(this.state, pendingPrompt)
      : strategyOption.strategy(this.state, seat, getLegalCommands(this.state, seat), {
          random: () => random.random(),
        });
    if (!command || command.seat === "judge") {
      return {
        finalResult: {
          success: false,
          error: "The selected One Piece strategy could not produce an action.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "strategy-stuck" },
      };
    }

    const { type, seat: _seat, ...payload } = command;
    return {
      finalResult: this.dispatch(type, actorId, payload, context),
      selectedCandidate: { family: type },
    };
  }

  submitInteraction(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult {
    const currentStateID = this.getStateID();
    const view = this.getInteractionView(actorId);
    const validation = validateInteractionSubmission(view, submission);
    if (!validation.ok) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.issues.some((issue) => issue.code === "stale_state")
          ? "stale_interaction"
          : "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }

    try {
      const translated = onePieceSubmissionToPayload(submission);
      return this.dispatch(translated.moveType, actorId, translated.payload, context);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid interaction submission.",
        errorCode: "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }
  }
}

/** Preserve native animation data; viewer safety is enforced by simulator rendering. */
export function onePiecePacketAnimation(animation: EngineAnimation): PacketAnimation {
  return {
    id: animation.id,
    kind: animation.type,
    durationMs: animation.duration,
    payload: animation.data,
  };
}

function redactHiddenSetupPayload(
  moveType: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  if (moveType !== "chooseJoKenPo") {
    return payload;
  }
  return { choice: "hidden" };
}

function redactHiddenSetupCommand(command: EngineCommand): unknown {
  if (command.type !== "chooseJoKenPo") {
    return command;
  }
  return {
    type: command.type,
    seat: command.seat,
    choice: "hidden",
  };
}

function redactHiddenSetupState(state: MatchState): unknown {
  const hiddenChoices = state.setup.joKenPo.hiddenChoices;
  if (!hiddenChoices.north && !hiddenChoices.south) {
    return state;
  }

  const redactedState = structuredClone(state) as MatchState;
  redactedState.setup.joKenPo.hiddenChoices = redactHiddenChoiceRecord(
    hiddenChoices,
  ) as unknown as MatchState["setup"]["joKenPo"]["hiddenChoices"];
  return redactedState;
}

function redactHiddenSetupPatches(patches: readonly unknown[]): readonly unknown[] {
  return patches.map((patch) => {
    if (!isImmerPatch(patch) || !isHiddenJoKenPoChoicePath(patch.path) || patch.op === "remove") {
      return patch;
    }

    return {
      ...patch,
      value:
        patch.path.length === 3 ? redactHiddenChoiceRecord(patch.value) : redactHiddenChoiceValue(),
    };
  });
}

function redactHiddenChoiceRecord(value: unknown): Partial<Record<MatchSeat, JoKenPoRedaction>> {
  const choices = isRecord(value) ? value : {};
  return {
    ...(choices.north ? { north: redactHiddenChoiceValue() } : {}),
    ...(choices.south ? { south: redactHiddenChoiceValue() } : {}),
  };
}

function redactHiddenChoiceValue(): JoKenPoRedaction {
  return "hidden";
}

type JoKenPoRedaction = "hidden";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isImmerPatch(patch: unknown): patch is {
  op: string;
  path: Array<string | number>;
  value?: unknown;
} {
  return (
    typeof patch === "object" &&
    patch !== null &&
    "op" in patch &&
    "path" in patch &&
    Array.isArray((patch as { path: unknown }).path)
  );
}

function isHiddenJoKenPoChoicePath(path: Array<string | number>): boolean {
  return path[0] === "setup" && path[1] === "joKenPo" && path[2] === "hiddenChoices";
}

function toCanonicalOnePieceMoveLog(
  log: GameLogEntry,
  moveType: string,
  seatToPlayerId: Record<MatchSeat, string>,
  timestamp: number,
) {
  const playerId = actorToPlayerId(log.actor, seatToPlayerId);
  const key = "one-piece.log.entry";
  const publicMessages =
    log.visibility === "public"
      ? [
          createEngineLogMessage({
            key,
            defaultMessage: log.message,
            values: onePieceLogValues(log, playerId),
          }),
        ]
      : [];
  const privateMessages = privateMessagesByPlayer(log, key, seatToPlayerId);

  return {
    ...createCanonicalEngineMoveLog({
      moveType,
      playerId,
      timestamp,
      turnNumber: log.turn,
      messages: publicMessages,
    }),
    ...(Object.keys(privateMessages).length > 0 ? { privateByPlayerId: privateMessages } : {}),
  };
}

function privateMessagesByPlayer(
  log: GameLogEntry,
  key: string,
  seatToPlayerId: Record<MatchSeat, string>,
) {
  const messagesByPlayerId: Record<string, ReturnType<typeof createEngineLogMessage>[]> = {};
  const actorSeat = log.actor === "north" || log.actor === "south" ? log.actor : undefined;
  const actorPlayerId = actorSeat ? seatToPlayerId[actorSeat] : undefined;

  for (const [seat, message] of Object.entries(log.privateMessages)) {
    const playerId = seat === "north" || seat === "south" ? seatToPlayerId[seat] : undefined;
    if (!playerId || !message) continue;
    messagesByPlayerId[playerId] ??= [];
    messagesByPlayerId[playerId].push(
      createEngineLogMessage({
        key,
        defaultMessage: message,
        values: onePieceLogValues(log, playerId),
      }),
    );
  }

  if (
    log.visibility === "private" &&
    actorPlayerId &&
    messagesByPlayerId[actorPlayerId] === undefined
  ) {
    messagesByPlayerId[actorPlayerId] = [
      createEngineLogMessage({
        key,
        defaultMessage: log.message,
        values: onePieceLogValues(log, actorPlayerId),
      }),
    ];
  }

  return messagesByPlayerId;
}

function onePieceLogValues(log: GameLogEntry, playerId: string): Record<string, unknown> {
  return {
    logId: log.id,
    eventId: log.eventId,
    playerId,
    actor: log.actor,
    phase: log.phase,
    sourceCardId: log.sourceCardId,
    sourceInstanceId: log.sourceInstanceId,
    targetIds: log.targetIds,
    visibility: log.visibility,
  };
}

function actorToPlayerId(actor: GameLogEntry["actor"], seatToPlayerId: Record<MatchSeat, string>) {
  if (actor === "north" || actor === "south") {
    return seatToPlayerId[actor] ?? actor;
  }
  return actor;
}

function buildEngineCommand(
  moveType: string,
  seat: MatchSeat,
  payload: Record<string, unknown>,
): EngineCommand | null {
  switch (moveType) {
    case "chooseJoKenPo":
      if (
        payload.choice !== "rock" &&
        payload.choice !== "paper" &&
        payload.choice !== "scissors"
      ) {
        return null;
      }
      return { type: "chooseJoKenPo", seat, choice: payload.choice };
    case "chooseFirstPlayer":
      if (payload.firstPlayer !== "south" && payload.firstPlayer !== "north") {
        return null;
      }
      return { type: "chooseFirstPlayer", seat, firstPlayer: payload.firstPlayer };
    case "mulligan":
      return { type: "mulligan", seat };
    case "keepHand":
      return { type: "keepHand", seat };
    case "startGame":
      return { type: "startGame", seat };
    case "endTurn":
      return { type: "endTurn", seat };
    case "playCard":
      return {
        type: "playCard",
        seat,
        instanceId: typeof payload.instanceId === "string" ? payload.instanceId : "",
        slotIndex: typeof payload.slotIndex === "number" ? payload.slotIndex : undefined,
      };
    case "attachDon":
      return {
        type: "attachDon",
        seat,
        targetId: typeof payload.targetId === "string" ? payload.targetId : "",
        amount: typeof payload.amount === "number" ? payload.amount : undefined,
      };
    case "declareAttack":
      return {
        type: "declareAttack",
        seat,
        attackerId: typeof payload.attackerId === "string" ? payload.attackerId : "",
        targetId: typeof payload.targetId === "string" ? payload.targetId : "",
      };
    case "activateEffect":
      return {
        type: "activateEffect",
        seat,
        sourceInstanceId:
          typeof payload.sourceInstanceId === "string" ? payload.sourceInstanceId : "",
        trigger:
          payload.trigger === "activateMain" || payload.trigger === "main"
            ? payload.trigger
            : "main",
        trashHandIds: Array.isArray(payload.trashHandIds)
          ? payload.trashHandIds.filter((id): id is string => typeof id === "string")
          : undefined,
      };
    case "resolvePrompt":
      return {
        type: "resolvePrompt",
        seat,
        promptId: typeof payload.promptId === "string" ? payload.promptId : "",
        optionId: typeof payload.optionId === "string" ? payload.optionId : undefined,
        selectedIds: Array.isArray(payload.selectedIds)
          ? payload.selectedIds.filter((id): id is string => typeof id === "string")
          : undefined,
        confirm: typeof payload.confirm === "boolean" ? payload.confirm : undefined,
      };
    case "judgeResolvePrompt":
      return {
        type: "judgeResolvePrompt",
        seat: "judge",
        promptId: typeof payload.promptId === "string" ? payload.promptId : "",
        note: typeof payload.note === "string" ? payload.note : "",
      };
    case "judgeMoveCard":
      return {
        type: "judgeMoveCard",
        seat: "judge",
        instanceId: typeof payload.instanceId === "string" ? payload.instanceId : "",
        owner: payload.owner === "south" || payload.owner === "north" ? payload.owner : "south",
        zone: payload.zone as Exclude<CardZone, "leader">,
        slotIndex: typeof payload.slotIndex === "number" ? payload.slotIndex : undefined,
        deckPosition:
          payload.deckPosition === "top" || payload.deckPosition === "bottom"
            ? payload.deckPosition
            : undefined,
        note: typeof payload.note === "string" ? payload.note : undefined,
      };
    case "judgeSetWinner":
      return {
        type: "judgeSetWinner",
        seat: "judge",
        winner: payload.winner === "south" || payload.winner === "north" ? payload.winner : "south",
        note: typeof payload.note === "string" ? payload.note : undefined,
      };
    default:
      return null;
  }
}

function isJudgeOnlyMove(moveType: string): moveType is JudgeCommand["type"] {
  return (
    moveType === "judgeResolvePrompt" ||
    moveType === "judgeMoveCard" ||
    moveType === "judgeSetWinner"
  );
}
