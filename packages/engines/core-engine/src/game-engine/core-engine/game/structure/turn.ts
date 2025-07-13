import { logger } from "@lorcanito/shared/libs/logger";
import { gameEvent } from "~/game-engine/core-engine/engine/action-creators";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import {
  endPhase,
  type PhaseMap,
  processPhases,
} from "~/game-engine/core-engine/game/structure/phase";
import { getSegment } from "~/game-engine/core-engine/game/structure/utils";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
  LogEntry,
  MoveMap,
  PlayerID,
} from "~/game-engine/core-engine/game-configuration";
import {
  getCurrentTurnPlayer,
  setNextTurnPlayer,
} from "~/game-engine/core-engine/state/context";
import { LogLevel } from "../../../types/log-types";
import { LogCollector } from "../../../utils/log-collector";

export interface TurnMap<G = unknown> {
  [turnName: string]: TurnConfig<G>;
}

export interface TurnConfig<G = unknown> {
  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: PlayerID };

  moves?: MoveMap<G>;
  phases?: PhaseMap<G>;
}

export function processTurns<G = unknown>(turnsMap: TurnMap<G>) {
  const turnMoveMap = {};
  const turnMoveNames = new Set<string>();

  for (const turn in turnsMap) {
    const turnConfig = turnsMap[turn];

    if (turnConfig.endIf === undefined) {
      turnConfig.endIf = () => undefined;
    }
    if (turnConfig.onBegin === undefined) {
      turnConfig.onBegin = ({ G }) => G;
    }
    if (turnConfig.onEnd === undefined) {
      turnConfig.onEnd = ({ G }) => G;
    }

    if (turnConfig.moves !== undefined) {
      for (const move of Object.keys(turnConfig.moves)) {
        turnMoveMap[move] = turnConfig.moves[move];
        turnMoveNames.add(move);
      }
    }

    if (turnConfig.phases !== undefined) {
      const { startingPhase, phaseMoveMap, phaseMoveNames } = processPhases(
        turnConfig.phases,
      );

      for (const moveName of Object.keys(phaseMoveMap)) {
        turnMoveMap[moveName] = phaseMoveMap[moveName];
      }

      for (const moveName of phaseMoveNames) {
        turnMoveNames.add(moveName);
      }
    }
  }

  return { turnMoveMap, turnMoveNames };
}

export function startTurn(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { arg, ...rest }: any = {},
): CoreEngineState {
  let { ctx } = state;
  const segmentConfig = getSegment(ctx, gameDefinition);

  if (!segmentConfig) {
    throw new Error(`No segment found for ${ctx.currentSegment}`);
  }

  const numTurn = ctx.numTurns + 1;
  ctx = { ...ctx, numTurns: numTurn, numTurnMoves: 0 };

  // Apply turn begin hook (if exists)
  let G = state.G;
  if (segmentConfig.turn.onBegin) {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({
        state,
        engine: undefined,
        logCollector: state.ctx.logCollector,
      }),
      logCollector: state.ctx.logCollector,
    };
    const newG = segmentConfig.turn.onBegin(context);
    if (newG !== undefined) {
      G = newG;
    }
  }

  return { ...state, G, ctx, _undo: [], _redo: [] } as CoreEngineState;
}

export function updateTurn(
  state: CoreEngineState,
  { arg, currentPlayer, next },
  _gameDefinition: GameDefinition,
): CoreEngineState {
  // Update turn player to next player in order
  const newCtx = setNextTurnPlayer(state.ctx);

  return {
    ...state,
    ctx: {
      ...newCtx,
      numTurnMoves: 0, // Reset turn moves counter
    },
  };
}

export function shouldEndTurn(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
): boolean | undefined | { next: PlayerID } {
  const segmentConfig = getSegment(state.ctx, gameDefinition);
  if (!segmentConfig) {
    return false;
  }
  const context = {
    G: state.G,
    ctx: state.ctx,
    coreOps: new CoreOperation({
      state,
      engine: undefined,
      logCollector: state.ctx.logCollector,
    }),
    logCollector: state.ctx.logCollector,
  };
  return segmentConfig.turn.endIf ? segmentConfig.turn.endIf(context) : false;
}

export function endTurn(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { arg, next = [], turn: initialTurn, force, automatic, playerID }: any = {},
): CoreEngineState {
  // This is not the turn that EndTurn was originally
  // called for. The turn was probably ended some other way.
  if (initialTurn !== undefined && initialTurn !== state.ctx.currentTurn) {
    const logCollector = state.ctx.logCollector || new LogCollector();
    logCollector.log(
      LogLevel.DEVELOPER,
      `endTurn called for turn ${initialTurn}, but current turn is ${state.ctx.currentTurn}. Ignoring.`,
    );
    return state;
  }

  // End any active phases
  state = endPhase(state, gameDefinition, { force: true });

  const { currentSegment, numTurns } = state.ctx;

  // Apply turn end hook if available and segment exists
  let G = state.G;
  const segmentConfig = getSegment(state.ctx, gameDefinition);
  if (segmentConfig?.turn.onEnd) {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({
        state,
        engine: undefined,
        logCollector: state.ctx.logCollector,
      }),
      logCollector: state.ctx.logCollector,
    };
    const newG = segmentConfig.turn.onEnd(context);
    if (newG !== undefined) {
      G = newG;
    }
  }

  // Schedule the turn update
  next.push({
    fn: updateTurn,
    arg,
    currentPlayer: getCurrentTurnPlayer(state.ctx),
  });

  // Create log entry
  const action = gameEvent("endTurn", arg);
  const { _stateID = 0 } = state;
  const logEntry: LogEntry = {
    action,
    _stateID,
    numTurn: numTurns,
    segment: currentSegment,
  };

  if (automatic) {
    logEntry.automatic = true;
  }

  const deltalog = [...(state.deltalog || []), logEntry];

  return { ...state, G, deltalog, _undo: [], _redo: [] };
}
