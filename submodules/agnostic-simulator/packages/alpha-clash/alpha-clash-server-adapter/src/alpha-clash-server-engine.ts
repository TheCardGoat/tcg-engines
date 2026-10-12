import { routeResourceInputs } from "./cost-routes";
import {
  resourcePaymentInput,
  readResourcePayment,
  healthResourcePaymentInputs,
} from "./resource-payment";
import {
  applyCommand,
  initiateClash,
  declareObstructors,
  resolveEffectTargets,
  projectState,
  canEnterResource,
  normalizeNamedCounters,
} from "@tcg/alpha-clash-engine";
import type { AcCommand, MatchState, PlayerId, ProjectedState } from "@tcg/alpha-clash-engine";
import {
  validateInteractionSubmission,
  INTERACTION_PROTOCOL_VERSION,
  type AnimationPlanV2,
  type EngineInteractionView,
  type InteractionSubmission,
  type InteractionAction,
} from "@tcg/protocol";
import {
  capUndoCheckpoints,
  createCanonicalEngineMoveLog,
  createEngineLogMessage,
} from "@tcg/shared/game-engine";
import type {
  AcceptedMoveRecord,
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import {
  alphaClashSubmissionToPayload,
  buildAlphaClashInteractionView,
} from "./interaction-protocol";
import { alphaClashBotCommandCandidates } from "./bot";
import { ALPHA_CLASH_HEURISTICS, alphaClashHeuristicCommand } from "./heuristic";
import { openingActionFor } from "./opening";
import { isAcJudgeMove, parseAcJudgeCommand } from "@tcg/alpha-clash-engine";
import {
  emptyAlphaClashUndoState,
  hasAlphaClashUndoBarrier,
  isPlayingTurn,
  type AlphaClashUndoCheckpoint,
  type AlphaClashUndoState,
} from "./undo";

/** The engine's two seats (rule 103.1); platform actor ids map onto them. */
type Seat = PlayerId;

export class AlphaClashServerEngine implements ServerGameEngine {
  private lastLoggedSequence: number;
  /**
   * Monotonic per-applied-command version. moveLog.length is NOT a valid
   * substitute: commands that apply without logging (startGame) would replay
   * the previous version and platform persistence would drop the update.
   */
  private versionCounter: number;
  private undoState: AlphaClashUndoState;

  state: MatchState;
  readonly playerIdToSeat: Record<string, Seat>;

  constructor(
    state: MatchState,
    playerIdToSeat: Record<string, Seat>,
    undoState?: AlphaClashUndoState,
  ) {
    normalizeNamedCounters(state);
    this.state = state;
    this.playerIdToSeat = playerIdToSeat;
    this.lastLoggedSequence = state.moveLog.at(-1)?.sequence ?? 0;
    this.versionCounter = state.stateID ?? state.moveLog.length;
    this.undoState = undoState ?? emptyAlphaClashUndoState(state, this.versionCounter);
  }

  getUndoState(): AlphaClashUndoState {
    return structuredClone(this.undoState);
  }

  canUndo(actorId: string): boolean {
    const checkpoint = this.undoState.checkpoints.at(-1);
    return Boolean(
      checkpoint &&
      checkpoint.actorId === actorId &&
      isPlayingTurn(this.state) &&
      checkpoint.state.turnNumber === this.state.turnNumber &&
      this.seatToPlayerId[this.state.activePlayer] === actorId,
    );
  }

  canUndoToTurnStart(actorId: string): boolean {
    return (
      this.canUndo(actorId) &&
      this.undoState.turnStart?.actorId === actorId &&
      this.undoState.turnStart.state.turnNumber === this.state.turnNumber
    );
  }

  private restoreUndo(
    actorId: string,
    context: DispatchContext,
    scope: "last_move" | "turn_start",
  ): DispatchResult {
    const checkpoint =
      scope === "last_move" ? this.undoState.checkpoints.at(-1) : this.undoState.turnStart;
    const allowed =
      scope === "last_move" ? this.canUndo(actorId) : this.canUndoToTurnStart(actorId);
    if (!allowed || !checkpoint) {
      return {
        success: false,
        error: "No action is available to undo.",
        errorCode: "undo_unavailable",
        stateID: this.getStateID(),
      };
    }
    const previousStateID = this.getStateID();
    const restoredTurnStart = checkpoint.stateVersion === this.undoState.turnStart?.stateVersion;
    this.state = structuredClone(checkpoint.state);
    normalizeNamedCounters(this.state);
    this.versionCounter += 1;
    this.state.stateID = this.versionCounter;
    this.lastLoggedSequence = this.state.moveLog.at(-1)?.sequence ?? 0;
    if (scope === "turn_start")
      this.undoState = emptyAlphaClashUndoState(this.state, this.versionCounter);
    else {
      this.undoState.checkpoints.pop();
      if (this.undoState.checkpoints.length === 0) {
        this.undoState.turnStart = null;
        this.undoState.turnStartStateVersion = restoredTurnStart ? this.versionCounter : null;
      }
    }
    const moveId = scope === "turn_start" ? "undoToTurnStart" : "undo";
    const timestamp = Date.now();
    return {
      success: true,
      stateID: this.versionCounter,
      state: this.state,
      animations: [],
      animationPlan: this.nullAnimationPlan(),
      transition: "move",
      undoable: this.canUndo(actorId),
      acceptedMoveRecord: {
        gameId: context.gameId,
        stateVersion: this.versionCounter,
        turnNumber: this.state.turnNumber,
        actorId,
        moveId,
        input: { args: {} },
        processedCommand: { move: moveId },
        timestamp,
        sourceAuthority: context.sourceAuthority,
        transitionType: "undo",
        newStateID: this.versionCounter,
        undoneStateID: previousStateID,
        restoredCheckpointStateID: checkpoint.stateVersion,
        ...(scope === "last_move" ? { undoneMoveId: checkpoint.moveId } : {}),
      },
      engineLogRecords: [
        {
          gameId: context.gameId,
          stateVersion: this.versionCounter,
          timestamp,
          sourceAuthority: context.sourceAuthority,
          log: createCanonicalEngineMoveLog({
            moveType: moveId,
            playerId: actorId,
            timestamp,
            turnNumber: this.state.turnNumber,
            messages: [
              createEngineLogMessage({
                key: "alpha-clash.undo",
                defaultMessage:
                  scope === "turn_start" ? "Undid the turn." : "Undid the last action.",
              }),
            ],
          }),
        },
      ],
    };
  }

  get seatToPlayerId(): Record<Seat, string> {
    const map: Partial<Record<Seat, string>> = {};
    for (const [playerId, seat] of Object.entries(this.playerIdToSeat)) {
      map[seat] = playerId;
    }
    return map as Record<Seat, string>;
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    if (isAcJudgeMove(moveType) && context.correctionModeEnabled !== true) {
      return {
        success: false,
        error: "Request opponent approval before correcting the game state.",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      };
    }
    if (context.correctionModeEnabled && !isAcJudgeMove(moveType) && moveType !== "concede") {
      return {
        success: false,
        error: "Exit game state correction before continuing play.",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      };
    }
    if (moveType === "undo") return this.restoreUndo(actorId, context, "last_move");
    if (moveType === "undoToTurnStart") return this.restoreUndo(actorId, context, "turn_start");
    const seat = this.playerIdToSeat[actorId];
    if (!seat) {
      return {
        success: false,
        error: `Unknown actor: ${actorId}`,
        errorCode: "INVALID_ARGUMENTS",
        stateID: this.getStateID(),
      };
    }

    let command: AcCommand | null;
    try {
      command = buildEngineCommand(moveType, seat, payload);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid payment.",
        errorCode: "INVALID_ARGUMENTS",
        stateID: this.getStateID(),
      };
    }
    if (!command) {
      return {
        success: false,
        error: `Unknown move type: ${moveType}`,
        errorCode: "UNKNOWN_MOVE",
        stateID: this.getStateID(),
      };
    }

    const before = structuredClone(this.state);
    const result = applyCommand(this.state, command);
    if (!result.success) {
      return {
        success: false,
        error: result.error ?? "Command rejected",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      };
    }

    this.state = result.state;
    // Drain forced passes inside the authoritative transition, before logs,
    // undo barriers and persistence observe the final state.
    if (!isAcJudgeMove(moveType)) this.drainEmptyResponseWindows();
    this.versionCounter += 1;
    this.state.stateID = this.versionCounter;
    const stateVersion = this.getStateID();
    if (hasAlphaClashUndoBarrier(before, result.state, command) || !isPlayingTurn(result.state)) {
      this.undoState = emptyAlphaClashUndoState(
        result.state,
        stateVersion,
        before.turnNumber !== result.state.turnNumber || before.phase.name === "setup",
      );
    } else {
      const checkpoint: AlphaClashUndoCheckpoint = {
        actorId,
        moveId: moveType,
        stateVersion: stateVersion - 1,
        state: before,
      };
      if (this.undoState.turnStartStateVersion === stateVersion - 1 && !this.undoState.turnStart) {
        this.undoState.turnStart = checkpoint;
      }
      this.undoState.checkpoints = capUndoCheckpoints([...this.undoState.checkpoints, checkpoint]);
    }
    const timestamp = Date.now();
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion,
      turnNumber: result.state.turnNumber,
      actorId,
      moveId: moveType,
      input: { args: payload },
      processedCommand: command,
      timestamp,
      sourceAuthority: context.sourceAuthority,
      newStateID: stateVersion,
      transitionType: "move",
    };

    // Public engine move log entries become canonical records; private
    // entries (hidden-zone moves) stay out of the public payload.
    const engineLogRecords: EngineLogRecord[] = result.state.moveLog
      .filter((entry) => entry.sequence > this.lastLoggedSequence)
      .map((entry) => ({
        gameId: context.gameId,
        stateVersion,
        timestamp,
        sourceAuthority: context.sourceAuthority,
        log: toCanonicalLog(entry, command.type, actorId, this.seatToPlayerId, timestamp),
      }));
    this.lastLoggedSequence = result.state.moveLog.at(-1)?.sequence ?? this.lastLoggedSequence;

    return {
      success: true,
      stateID: stateVersion,
      state: result.state,
      animations: [],
      animationPlan: this.nullAnimationPlan(),
      transition: "move",
      undoable: this.canUndo(actorId),
      acceptedMoveRecord,
      engineLogRecords,
      ...(isAcJudgeMove(moveType) ? { commandVisibility: "actor" as const } : {}),
    };
  }

  /** Native passes advance empty windows until the next player decision. */
  private drainEmptyResponseWindows(): void {
    for (let guard = 0; guard < 200 && !this.hasGameEnded(); guard++) {
      if (this.state.pendingChoices.length || this.state.pendingTriggers.length) return;
      if (!this.state.responseWindow && !this.state.clash) return;
      const actor = this.getActivePlayerId();
      if (!actor) return;
      const actions = this.getInteractionView(actor).actions.filter(
        (action) => action.enabled && action.id !== "concede",
      );
      const pass = actions.find((action) =>
        ["passCounter", "passClashStep", "passObstruct"].includes(action.id),
      );
      if (!pass) return;
      const hasDecision = actions.some((action) => {
        if (["passCounter", "passClashStep", "passObstruct"].includes(action.id)) return false;
        if (pass.id === "passObstruct" && action.id === "declareObstructors") {
          return !action.inputs.every(
            (input) =>
              input.kind === "entity-selection" &&
              input.min === 0 &&
              !input.candidates.some((candidate) => candidate.enabled),
          );
        }
        return true;
      });
      if (hasDecision) return;
      const seat = this.playerIdToSeat[actor];
      const result = applyCommand(this.state, { type: "pass", playerId: seat });
      if (!result.success) return;
      this.state = result.state;
    }
  }

  /** Alpha Clash's engine emits no animation packets yet; the plan is empty. */
  private nullAnimationPlan(): AnimationPlanV2 | null {
    return null;
  }

  getStateID(): number {
    return this.versionCounter;
  }

  getState(): unknown {
    return this.state;
  }

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): ProjectedState & { readonly decisionSeat?: Seat } {
    const seat = viewer.role === "player" ? this.playerIdToSeat[viewer.actorId] : "spectator";
    return {
      ...projectState(this.state, seat ?? "spectator"),
      // Public pacing only. Choice candidates remain filtered by projectState.
      decisionSeat: this.hasGameEnded()
        ? undefined
        : this.playerIdToSeat[this.getActivePlayerId() ?? ""],
    };
  }

  getActivePlayerId(): string | undefined {
    const seat = alphaClashDecisionSeat(this.state);
    return seat ? this.seatToPlayerId[seat] : undefined;
  }

  hasGameEnded(): boolean {
    return this.state.phase.name === "complete";
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    if (this.state.phase.name !== "complete") return undefined;
    return {
      winnerId: this.seatToPlayerId[this.state.phase.winner],
      reason: this.state.phase.reason,
    };
  }

  getInteractionView(actorId: string): EngineInteractionView {
    const seat = this.playerIdToSeat[actorId] ?? "spectator";
    const playerView = projectState(this.state, seat);
    if (seat !== "player-one" && seat !== "player-two")
      return {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        gameSlug: "alpha-clash",
        actorId,
        stateVersion: this.getStateID(),
        status: this.hasGameEnded() ? "game-over" : "waiting",
        actions: [],
      };
    const view = buildAlphaClashInteractionView({
      actorId,
      seat,
      decisionSeat: this.playerIdToSeat[this.getActivePlayerId() ?? ""],
      stateVersion: this.getStateID(),
      playerView,
      clashTargets:
        this.state.phase.name === "primary" &&
        this.state.activePlayer === seat &&
        !this.state.responseWindow &&
        !this.state.pendingChoices.length
          ? Object.fromEntries(
              playerView.cards
                .filter(
                  (card) =>
                    card.controller === seat &&
                    card.ready &&
                    (card.zone === "clash" || card.zone === "contender"),
                )
                .map((attacker) => [
                  attacker.instanceId,
                  playerView.cards
                    .filter(
                      (card) =>
                        card.controller !== seat &&
                        (card.zone === "clash" || card.zone === "contender") &&
                        initiateClash(
                          structuredClone(this.state),
                          seat,
                          attacker.instanceId,
                          card.instanceId,
                          true,
                        ) === null,
                    )
                    .map((card) => card.instanceId),
                ]),
            )
          : undefined,
      obstructorSelection: nativeObstructorSelection(this.state, seat, playerView),
      resolveTargetCandidates: (target, sourceId) => {
        const selector = target.type === "declared" ? target.selector : target;
        const legal = resolveEffectTargets(
          this.state,
          "chosen" in selector ? { ...selector, chosen: false } : selector,
          { state: this.state, playerId: seat, sourceId },
        );
        // Native player selectors return seat IDs, not Contender card IDs.
        // Both seats are public; card selectors still use viewer-safe projection.
        if (selector.type === "player")
          return legal.filter((id) => id === "player-one" || id === "player-two");
        return legal.filter((id) =>
          playerView.cards.some(
            (card) =>
              card.instanceId === id &&
              (card.definitionId !== null || (card.zone !== "deck" && card.zone !== "hand")),
          ),
        );
      },
      resourceCandidateIds: playerView.cards
        .filter(
          (card) =>
            card.controller === seat &&
            card.zone === "hand" &&
            canEnterResource(this.state, card.instanceId, seat),
        )
        .map((card) => card.instanceId),
    });
    return {
      ...view,
      actions: view.actions.map((action) => {
        // Route cards declare their cost route first; their resource slots are
        // route-scoped (the alternative route waives the cost), so the shared
        // plain-payment quote would be wrong for them.
        if (action.inputs.some((input) => input.id === "costRoute")) {
          return {
            ...action,
            inputs: [...action.inputs, ...routeResourceInputs(playerView, seat, action)],
          };
        }
        if (action.inputs.some((input) => input.id === "healthReduction")) {
          return {
            ...action,
            inputs: [
              ...action.inputs,
              ...healthResourcePaymentInputs(this.state, playerView, seat, action),
            ],
          };
        }
        const payment = resourcePaymentInput(this.state, playerView, seat, action);
        const checked = previewNativeBoardAction(this.state, seat, action);
        if (payment) return { ...checked, inputs: [...checked.inputs, payment] };
        return checked;
      }),
    };
  }

  getInteractionActorIds(): readonly string[] {
    return Object.keys(this.playerIdToSeat);
  }

  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const actorId = this.getActivePlayerId() ?? this.activeActorId();
    if (!actorId) {
      return {
        finalResult: {
          success: false,
          error: "Alpha Clash has no active bot actor.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "no-active-actor" },
      };
    }
    const seat = this.playerIdToSeat[actorId];
    // Meta policies already probe legality. The basic policy supplies fallbacks.
    const strategyId = options.strategyId ?? "default";
    const heuristic = ALPHA_CLASH_HEURISTICS[strategyId];
    if (!heuristic && strategyId !== "default" && strategyId !== "practice-v1") {
      return {
        finalResult: {
          success: false,
          error: `Unknown Alpha Clash bot strategy: ${strategyId}`,
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "strategy-stuck" },
      };
    }
    const proposal = heuristic ? alphaClashHeuristicCommand(this.state, seat, heuristic) : null;
    const candidates = heuristic
      ? proposal
        ? [proposal]
        : []
      : alphaClashBotCommandCandidates(this.state, seat);
    let lastFailure: BotActionResult = {
      finalResult: {
        success: false,
        error: "The Alpha Clash automation policy could not produce an action.",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      },
      blocked: { reason: "strategy-stuck" },
    };
    for (const command of candidates) {
      const payload: Record<string, unknown> = { ...command };
      delete payload.type;
      const finalResult = this.dispatch(command.type, actorId, payload, context);
      if (finalResult.success) {
        return {
          finalResult,
          selectedCandidate: { family: command.type },
        };
      }
      lastFailure = { finalResult };
    }
    return lastFailure;
  }

  private activeActorId(): string {
    return this.seatToPlayerId[this.state.activePlayer] ?? Object.keys(this.playerIdToSeat)[0];
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
      const translated = alphaClashSubmissionToPayload(submission);
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

/** The same native decision owner drives local practice and headless bot-lab. */
export function alphaClashDecisionSeat(state: MatchState): PlayerId | undefined {
  if (state.phase.name === "setup") {
    const view = projectState(state, "spectator");
    const other = state.activePlayer === "player-one" ? "player-two" : "player-one";
    const order: PlayerId[] = [state.activePlayer, other];
    return order.find((candidate) => openingActionFor(view, candidate) !== "wait");
  }
  if (state.pendingChoices[0]) return state.pendingChoices[0].playerId;
  if (state.responseWindow) return state.responseWindow.openFor;
  return state.clash ? clashStepSeat(state) : state.activePlayer;
}

/** The seat whose turn it is to act, from the engine's public pacing state. */
export function clashStepSeat(state: MatchState): Seat | undefined {
  const pendingChoice = state.pendingChoices[0];
  if (pendingChoice) return pendingChoice.playerId;
  if (state.responseWindow) return state.responseWindow.openFor;
  if (!state.clash) return state.activePlayer;
  const attacker = state.cards[state.clash.attackerId]?.controller;
  switch (state.clash.step) {
    case "attack":
    case "attackerBuff":
      return attacker ?? state.activePlayer;
    case "counter":
    case "obstruct":
    case "defenderBuff":
      return attacker ? (attacker === "player-one" ? "player-two" : "player-one") : undefined;
    case "beforeDamage":
      // Rule 504.2f (v8.0): the attacker holds priority until they pass;
      // afterwards the defender may act or pass into the damage step.
      if (state.clash.attackerPassedBeforeDamage) {
        return attacker ? (attacker === "player-one" ? "player-two" : "player-one") : undefined;
      }
      return attacker ?? state.activePlayer;
    default:
      return undefined;
  }
}

/** Ask native declaration validation for individual cards and pairs. Pairs
 * preserve Torment's minimum without incorrectly hiding every candidate. */
function nativeObstructorSelection(state: MatchState, seat: Seat, view: ProjectedState) {
  if (
    state.phase.name !== "clash" ||
    state.clash?.step !== "obstruct" ||
    state.activePlayer === seat ||
    state.responseWindow ||
    state.pendingChoices.length
  )
    return undefined;
  const ids = view.cards
    .filter((card) => card.controller === seat && card.zone === "clash" && card.ready)
    .map((card) => card.instanceId);
  const valid = (selection: readonly string[]) =>
    declareObstructors(structuredClone(state), seat, selection) === null;
  const singles = ids.filter((id) => valid([id]));
  const candidateIds = ids.filter(
    (id) => singles.includes(id) || ids.some((other) => other !== id && valid([id, other])),
  );
  return { candidateIds, min: candidateIds.length > 0 && singles.length === 0 ? 2 : 0 };
}

/** Preview only complete, bounded board commands. Never mutate the live match or
 * guess costs from printed values; modifiers and restrictions belong to native code. */
function previewNativeBoardAction(
  state: MatchState,
  seat: Seat,
  action: InteractionAction,
): InteractionAction {
  if (
    !/^(playCard:|respond:|setCard:|attachWeapon:|detachWeapon:|activateAbility:|activatePortal$)/.test(
      action.id,
    )
  )
    return action;
  const preview = (values: InteractionSubmission["values"]) => {
    const translated = alphaClashSubmissionToPayload({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 0,
      requestId: action.requestId,
      actionId: action.id,
      values,
    });
    const command = buildEngineCommand(translated.moveType, seat, translated.payload);
    return command ? applyCommand(structuredClone(state), command) : null;
  };
  if (action.inputs.length === 0) {
    const result = preview({});
    return result
      ? {
          ...action,
          enabled: result.success,
          disabledText: result.success ? undefined : { key: result.error ?? "Action unavailable" },
        }
      : action;
  }
  // A single host/target input can be checked exhaustively. Leave multi-stage
  // costs and multi-target relationships to their own native projection.
  const input = action.inputs[0];
  if (
    action.inputs.length !== 1 ||
    input.kind !== "entity-selection" ||
    input.min !== 1 ||
    input.max !== 1
  )
    return action;
  const candidates = input.candidates.map((candidate) => {
    if (!candidate.enabled) return candidate;
    const result = preview({ [input.id]: [candidate.entity.instanceId] });
    return result
      ? {
          ...candidate,
          enabled: result.success,
          disabledText: result.success ? undefined : { key: result.error ?? "Target unavailable" },
        }
      : candidate;
  });
  const enabled = candidates.some((candidate) => candidate.enabled);
  return {
    ...action,
    enabled,
    disabledText: enabled
      ? undefined
      : candidates.find((candidate) => candidate.disabledText)?.disabledText,
    inputs: [{ ...input, candidates, min: enabled ? 1 : 0, max: enabled ? 1 : 0 }],
  };
}

function buildEngineCommand(
  moveType: string,
  seat: Seat,
  payload: Record<string, unknown>,
): AcCommand | null {
  if (isAcJudgeMove(moveType)) return parseAcJudgeCommand(moveType, seat, payload);
  const cardId = typeof payload.cardId === "string" ? payload.cardId : "";
  switch (moveType) {
    case "startGame":
      return { type: "startGame" };
    case "declareMulligan":
      return typeof payload.take === "boolean"
        ? { type: "declareMulligan", playerId: seat, take: payload.take }
        : null;
    case "mulligan":
      return {
        type: "mulligan",
        playerId: seat,
        cardIds: Array.isArray(payload.cardIds) ? (payload.cardIds as string[]) : [],
      };
    case "deployResource":
      return { type: "deployResource", playerId: seat, cardId };
    case "playCard": {
      if (!cardId) return null;
      return {
        type: "playCard",
        playerId: seat,
        cardId,
        resourcePayment: readResourcePayment(payload.resourcePayment),
        ...(typeof payload.targetId === "string" ? { targetId: payload.targetId } : {}),
        ...(Array.isArray(payload.targetIds)
          ? { targetIds: payload.targetIds.filter((id): id is string => typeof id === "string") }
          : {}),
        ...(typeof payload.xValue === "number" ? { xValue: payload.xValue } : {}),
        ...(Array.isArray(payload.discardCostIds)
          ? {
              discardCostIds: payload.discardCostIds.filter(
                (id): id is string => typeof id === "string",
              ),
            }
          : {}),
        ...(Array.isArray(payload.sendCostCardIds)
          ? {
              sendCostCardIds: payload.sendCostCardIds.filter(
                (id): id is string => typeof id === "string",
              ),
            }
          : {}),
        ...(Array.isArray(payload.alternateCostCardIds)
          ? {
              alternateCostCardIds: payload.alternateCostCardIds.filter(
                (id): id is string => typeof id === "string",
              ),
            }
          : {}),
      };
    }
    case "setCard":
      return cardId ? { type: "setCard", playerId: seat, cardId } : null;
    case "respond":
      return cardId
        ? {
            type: "respond",
            playerId: seat,
            cardId,
            resourcePayment: readResourcePayment(payload.resourcePayment),
            ...(Array.isArray(payload.discardCostIds)
              ? {
                  discardCostIds: payload.discardCostIds.filter(
                    (id): id is string => typeof id === "string",
                  ),
                }
              : {}),
            ...(typeof payload.targetId === "string" ? { targetId: payload.targetId } : {}),
            ...(typeof payload.healthReduction === "number"
              ? { healthReduction: payload.healthReduction }
              : {}),
            ...(typeof payload.xValue === "number" ? { xValue: payload.xValue } : {}),
          }
        : null;
    case "activatePortal":
      return { type: "activatePortal", playerId: seat };
    case "attachWeapon": {
      const targetId = typeof payload.targetId === "string" ? payload.targetId : "";
      return cardId && targetId
        ? { type: "attachWeapon", playerId: seat, weaponId: cardId, targetId }
        : null;
    }
    case "detachWeapon":
      return cardId ? { type: "detachWeapon", playerId: seat, weaponId: cardId } : null;
    case "initiateClash": {
      const attackerId = typeof payload.attackerId === "string" ? payload.attackerId : "";
      const targetId = typeof payload.targetId === "string" ? payload.targetId : "";
      return attackerId && targetId
        ? { type: "initiateClash", playerId: seat, attackerId, targetId }
        : null;
    }
    case "declareObstructors":
      return {
        type: "declareObstructors",
        playerId: seat,
        obstructorIds: Array.isArray(payload.obstructorIds)
          ? payload.obstructorIds.filter((id): id is string => typeof id === "string")
          : [],
      };
    case "activateAbility": {
      if (!cardId || typeof payload.abilityIndex !== "number") return null;
      return {
        type: "activateAbility",
        playerId: seat,
        cardId,
        abilityIndex: payload.abilityIndex,
        ...(typeof payload.targetId === "string" ? { targetId: payload.targetId } : {}),
        ...(Array.isArray(payload.targetIds)
          ? { targetIds: payload.targetIds.filter((id): id is string => typeof id === "string") }
          : {}),
        ...(typeof payload.xValue === "number" ? { xValue: payload.xValue } : {}),
      };
    }
    case "pass":
      return { type: "pass", playerId: seat };
    case "endTurn":
      return { type: "endTurn", playerId: seat };
    case "resolveChoice":
      return typeof payload.choiceId === "string"
        ? {
            type: "resolveChoice",
            playerId: seat,
            choiceId: payload.choiceId,
            ...(typeof payload.optionId === "string" ? { optionId: payload.optionId } : {}),
            ...(Array.isArray(payload.orderedIds) &&
            payload.orderedIds.every((id) => typeof id === "string")
              ? { orderedIds: payload.orderedIds }
              : {}),
            ...(payload.deckOrder !== undefined
              ? { deckOrder: readDeckOrder(payload.deckOrder) }
              : {}),
            ...(payload.division && typeof payload.division === "object"
              ? { division: payload.division as Record<string, number> }
              : {}),
          }
        : null;
    case "concede":
      return { type: "concede", playerId: seat };
    default:
      return null;
  }
}

function toCanonicalLog(
  entry: MatchState["moveLog"][number],
  moveType: string,
  actorId: string,
  seatToPlayerId: Record<Seat, string>,
  timestamp: number,
) {
  // Framework entries (state-based actions, phase moves) carry no playerId;
  // they are attributed to the dispatching actor.
  const playerId = entry.playerId ? seatToPlayerId[entry.playerId] : actorId;
  const key = "alpha-clash.log.entry";
  return createCanonicalEngineMoveLog({
    moveType,
    playerId,
    timestamp,
    sequence: entry.sequence,
    turnNumber: undefined,
    messages:
      entry.public || entry.playerId === undefined
        ? [
            createEngineLogMessage({
              key,
              defaultMessage: entry.message,
              values: { logType: entry.type },
            }),
          ]
        : [],
    ...(entry.public || entry.playerId === undefined
      ? {}
      : {
          privateByPlayerId: {
            [seatToPlayerId[entry.playerId] ?? entry.playerId]: [
              createEngineLogMessage({
                key,
                defaultMessage: entry.message,
                values: { logType: entry.type },
              }),
            ],
          },
        }),
  });
}

export type { ProjectedState };

function readDeckOrder(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid deck order.");
  const result: Record<string, string[]> = {};
  for (const [key, cards] of Object.entries(value)) {
    if (!Array.isArray(cards) || !cards.every((card): card is string => typeof card === "string"))
      throw new Error("Invalid deck group.");
    result[key] = cards;
  }
  return result;
}
