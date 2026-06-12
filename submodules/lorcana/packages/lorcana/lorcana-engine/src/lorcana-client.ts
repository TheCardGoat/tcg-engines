/**
 * Lorcana Client Runtime
 *
 * Client-first wrapper around .
 * Provides player-scoped move execution and projected board access.
 */

import { LorcanaEngineBase } from "./lorcana-engine-base";
import {
  ClientEngine,
  type ClientEngineConfig,
  type DeepReadonly,
  type Transport,
  type MatchRuntimeConfig,
  type PlayerId,
  type CommandResult,
  type ProtocolError,
} from "#core";
import type { CardInput } from "./types";
import { lorcanaRuntimeConfig } from "./runtime-game";
import type { LorcanaMatchState, LorcanaProjectedBoardView } from "./types";
import { type LorcanaBaseEngineParams } from "./engine-initialization";

type LorcanaClientParams = {
  playerId: string;
  role?: "player" | "spectator";
  transport?: Transport;
  identifier?: string;
  debugMode?: boolean;
  skipOptimisticState?: boolean;
};

export class LorcanaClient extends LorcanaEngineBase {
  private readonly _playerId: string;

  private previousProjectedBoard?: LorcanaProjectedBoardView;
  private projectedBoard?: LorcanaProjectedBoardView;
  private nextProjectedBoard?: LorcanaProjectedBoardView;

  engine: ClientEngine;

  constructor(params: LorcanaBaseEngineParams & LorcanaClientParams) {
    super(params);
    this._playerId = params.playerId;
    const staticResources = this.getResolvedStaticResources();

    const clientEngineConfig: ClientEngineConfig = {
      playerId: params.playerId,
      role: params.role || "spectator",
      runtimeConfig: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
      staticResources: staticResources,
      players: params.players,
      seed: params.seed,
      debugMode: params.debugMode ?? false,
      transport: params.transport,
      identifier: params.identifier,
      skipOptimisticState: params.skipOptimisticState,
      sandboxPostProcess: (sandboxRuntime, playerId, stateID) => {
        try {
          this.drainDeterministicBagEffectsInSandbox(sandboxRuntime, playerId, stateID);
        } catch (err) {
          // Swallow unexpected throws so optimistic state update is not lost
        }
      },
    };

    this.engine = new ClientEngine(clientEngineConfig);

    this.engine.onStateUpdate((board) => {
      this.cacheProjectedBoardUpdate(board as unknown as LorcanaProjectedBoardView);
    });
  }

  getClientPlayerId(): string {
    return this._playerId;
  }

  onProtocolError(handler: (error: ProtocolError) => void): () => void {
    return this.engine.onProtocolError(handler);
  }

  connectSync(): void {
    this.engine.connectSync();
  }

  getActorContext() {
    return this.engine.getActorContext();
  }

  getLastPacketUpdate() {
    return this.engine.getLastPacketUpdate();
  }

  getBoard(): LorcanaProjectedBoardView {
    const board = this.normalizeProjectedBoardPayload(
      this.engine.getBoard() as unknown as LorcanaProjectedBoardView,
    );
    this.projectedBoard = board;
    return board;
  }

  protected loadStateViaEngine(state: LorcanaMatchState): void {
    this.engine.loadState(state);

    // When loaded directly, we don't run the latest animation
    this.projectedBoard = this.normalizeProjectedBoardPayload(state);
  }

  protected normalizeProjectedBoardPayload(
    board:
      | LorcanaProjectedBoardView
      | DeepReadonly<LorcanaProjectedBoardView>
      | DeepReadonly<LorcanaMatchState>,
  ): LorcanaProjectedBoardView {
    if ("G" in board && "ctx" in board) {
      return this.projectState(board);
    }

    return board as LorcanaProjectedBoardView;
  }

  private cacheProjectedBoardUpdate(
    board: LorcanaProjectedBoardView | DeepReadonly<LorcanaMatchState>,
  ): void {
    this.previousProjectedBoard = this.projectedBoard;
    this.nextProjectedBoard = this.normalizeProjectedBoardPayload(board);

    // TODO: We should only update this.projectedBoard after we run the animation from this.nextProjectedBoard
    this.projectedBoard = this.nextProjectedBoard;
  }

  private projectState(state: DeepReadonly<LorcanaMatchState>): LorcanaProjectedBoardView {
    const actorContext = this.getActorContext();
    const roleCtx =
      actorContext.role === "player"
        ? { role: "player" as const, playerID: this.getClientPlayerId() }
        : { role: actorContext.role };

    const board = lorcanaRuntimeConfig.projectBoard(
      state as LorcanaMatchState,
      roleCtx,
      this.staticResources,
      {
        serverTimestamp: Date.now(),
      },
    ) as unknown as LorcanaProjectedBoardView;

    return board;
  }

  protected override enumerateMovesForPlayerViaEngine(playerId: string) {
    if (playerId !== this.getClientPlayerId()) {
      return [];
    }

    return this.enumerateMoves();
  }

  private rejectManualMove(): CommandResult {
    return this.createErrorResult("Manual Moves can Only be executed by the server");
  }

  // Manual / Board-State-Correction moves (`manualSetLore`,
  // `manualSetDamage`, `manualMoveCard`) are sent server-direct via
  // `gateway.send({ type: "execute_move", ... })` from the simulator UI
  // when Manual Mode is enabled. The client-side overrides below remain
  // because the engine path would either reject or apply optimistically
  // without the server gate; both are wrong for Manual Mode.
  override manualSetLore(playerId: PlayerId, amount: number): CommandResult {
    void playerId;
    void amount;
    return this.rejectManualMove();
  }

  override manualSetDamage(card: CardInput, damage: number): CommandResult {
    void card;
    void damage;
    return this.rejectManualMove();
  }

  override manualExertCard(card: CardInput): CommandResult {
    void card;
    return this.rejectManualMove();
  }

  override manualReadyCard(card: CardInput): CommandResult {
    void card;
    return this.rejectManualMove();
  }

  override manualDryCard(card: CardInput): CommandResult {
    void card;
    return this.rejectManualMove();
  }

  override manualShuffleDeck(playerId: PlayerId): CommandResult {
    void playerId;
    return this.rejectManualMove();
  }

  override manualPassTurn(): CommandResult {
    return this.rejectManualMove();
  }
}

export function createLorcanaClient(
  params: LorcanaBaseEngineParams & LorcanaClientParams,
): LorcanaClient {
  return new LorcanaClient(params);
}
