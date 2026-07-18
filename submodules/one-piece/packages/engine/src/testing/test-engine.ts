import {
  openTestSimulatorSnapshot,
  type OpenInSimulatorOptions,
  type OpenInSimulatorResult,
} from "@tcg/engine-core/test-simulator";
import type { EffectTrigger } from "@tcg/op-types";
import { applyCommand } from "../core.ts";
import { projectStateForSeat } from "../projection.ts";
import type {
  ApplyCommandResult,
  CardZone,
  EngineCommand,
  MatchSeat,
  MatchState,
  PlayerView,
  ProjectedDecision,
  PromptResolutionContext,
  Viewer,
} from "../types.ts";
import {
  createTestMatchState,
  type CardRef,
  type PlayerFixture,
  type TestMatchOptions,
  NORTH,
  PLAYER_ONE,
  PLAYER_TWO,
  SOUTH,
} from "./test-fixtures.ts";

export { NORTH, PLAYER_ONE, PLAYER_TWO, SOUTH };

export class MoveFailedError extends Error {
  readonly result: ApplyCommandResult;

  constructor(command: EngineCommand, result: ApplyCommandResult) {
    super(`Move ${command.type} failed: ${result.reason ?? "Command rejected."}`);
    this.name = "MoveFailedError";
    this.result = result;
  }
}

export class OnePieceTestEngine {
  private state: MatchState;

  private constructor(state: MatchState) {
    this.state = state;
  }

  static create(
    playerOneFixture: PlayerFixture = {},
    playerTwoFixture: PlayerFixture = {},
    options: TestMatchOptions = {},
  ): OnePieceTestEngine {
    return new OnePieceTestEngine(
      createTestMatchState(playerOneFixture, playerTwoFixture, options),
    );
  }

  static fromState(state: MatchState): OnePieceTestEngine {
    return new OnePieceTestEngine(state);
  }

  getState(): MatchState {
    return this.state;
  }

  openInSimulator(options: OpenInSimulatorOptions = {}): OpenInSimulatorResult {
    return openTestSimulatorSnapshot(
      {
        gameSlug: "one-piece",
        viewer: options.viewer ?? SOUTH,
        payload: {
          state: this.getState(),
        },
      },
      options,
    );
  }

  getView(viewer: Viewer): PlayerView {
    return projectStateForSeat(this.state, viewer);
  }

  exec(command: EngineCommand): ApplyCommandResult {
    const result = applyCommand(this.state, command);
    this.state = result.state;
    if (!result.accepted) {
      throw new MoveFailedError(command, result);
    }
    return result;
  }

  expectFailure(command: EngineCommand): ApplyCommandResult {
    const result = applyCommand(this.state, command);
    if (result.accepted) {
      throw new Error(`Expected ${command.type} to fail, but it was accepted.`);
    }
    return result;
  }

  findCardInZone(seat: MatchSeat, zone: CardZone, card: CardRef): string {
    const cardId = typeof card === "string" ? card : card.id;
    const player = this.state.players[seat];
    const pool = (() => {
      switch (zone) {
        case "leader":
          return [player.leaderInstanceId];
        case "character":
          return player.characterArea.filter((entry): entry is string => Boolean(entry));
        case "stage":
          return player.stageArea ? [player.stageArea] : [];
        case "deck":
        case "hand":
        case "life":
        case "trash":
          return player[zone];
        case "resolution":
          return Object.values(this.state.cards)
            .filter((instance) => instance.controller === seat && instance.zone === "resolution")
            .map((instance) => instance.instanceId);
      }
    })();
    const instanceId = pool.find((candidate) => this.state.cards[candidate]?.cardId === cardId);

    if (!instanceId) {
      throw new Error(`Could not find ${cardId} in ${seat} ${zone}.`);
    }

    return instanceId;
  }

  pendingDecision(
    intent: PromptResolutionContext["intent"],
    seat: MatchSeat = this.state.activeSeat,
  ): ProjectedDecision {
    const prompt = this.state.promptQueue.find(
      (candidate) =>
        candidate.kind === "choice" &&
        candidate.status === "pending" &&
        candidate.seat === seat &&
        candidate.resolutionContext?.intent === intent,
    );

    if (!prompt) {
      throw new Error(`Could not find a pending ${intent} prompt for ${seat}.`);
    }

    const decision = this.getView(seat).decisions.find((candidate) => candidate.id === prompt.id);
    if (!decision) {
      throw new Error(`Pending ${intent} prompt ${prompt.id} was not projected to ${seat}.`);
    }

    return decision;
  }

  resolveDecision(
    intent: PromptResolutionContext["intent"],
    resolution: { optionId?: string; selectedIds?: string[] },
    seat: MatchSeat = this.state.activeSeat,
  ) {
    const decision = this.pendingDecision(intent, seat);
    return this.exec({
      type: "resolvePrompt",
      seat,
      promptId: decision.id,
      ...resolution,
    });
  }

  leader(seat: MatchSeat): string {
    return this.state.players[seat].leaderInstanceId;
  }

  playCard(cardId: CardRef, seat: MatchSeat = this.state.activeSeat, slotIndex?: number) {
    return this.exec({
      type: "playCard",
      seat,
      instanceId: this.findCardInZone(seat, "hand", cardId),
      slotIndex,
    });
  }

  attachDon(targetId: string, amount = 1, seat: MatchSeat = this.state.activeSeat) {
    return this.exec({
      type: "attachDon",
      seat,
      targetId,
      amount,
    });
  }

  declareAttack(attackerId: string, targetId: string, seat: MatchSeat = this.state.activeSeat) {
    return this.exec({
      type: "declareAttack",
      seat,
      attackerId,
      targetId,
    });
  }

  activateEffect(
    sourceInstanceId: string,
    trigger: Extract<EffectTrigger, "activateMain" | "main">,
    seat: MatchSeat = this.state.activeSeat,
    trashHandIds?: string[],
  ) {
    return this.exec({
      type: "activateEffect",
      seat,
      sourceInstanceId,
      trigger,
      trashHandIds,
    });
  }

  startGame(seat: MatchSeat = SOUTH) {
    if (this.state.status === "setup") {
      if (!this.state.setup.joKenPo.winner) {
        this.exec({ type: "chooseJoKenPo", seat: SOUTH, choice: "paper" });
        this.exec({ type: "chooseJoKenPo", seat: NORTH, choice: "rock" });
      }
      if (!this.state.setup.joKenPo.firstPlayerDecided) {
        this.exec({
          type: "chooseFirstPlayer",
          seat: this.state.setup.joKenPo.winner ?? SOUTH,
          firstPlayer: seat,
        });
      }
      for (const setupSeat of ["south", "north"] as const) {
        if (!this.state.setup.mulliganDecided[setupSeat]) {
          this.exec({ type: "keepHand", seat: setupSeat });
        }
      }
    }
    return this.exec({ type: "startGame", seat });
  }

  endTurn(seat: MatchSeat = this.state.activeSeat) {
    return this.exec({ type: "endTurn", seat });
  }
}
