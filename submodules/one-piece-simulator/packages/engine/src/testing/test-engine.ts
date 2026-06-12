import type { EffectTrigger } from "@tcg/op-types";
import { applyCommand } from "../core.ts";
import { projectStateForSeat } from "../projection.ts";
import type {
  ApplyCommandResult,
  EngineCommand,
  MatchSeat,
  MatchState,
  PlayerView,
  Viewer,
} from "../types.ts";
import {
  createTestMatchState,
  type PlayerFixture,
  type TestMatchOptions,
  NORTH,
  SOUTH,
} from "./test-fixtures.ts";

export { NORTH, SOUTH };

export type CardRef = string;

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
    southFixture: PlayerFixture = {},
    northFixture: PlayerFixture = {},
    options: TestMatchOptions = {},
  ): OnePieceTestEngine {
    return new OnePieceTestEngine(createTestMatchState(southFixture, northFixture, options));
  }

  static fromState(state: MatchState): OnePieceTestEngine {
    return new OnePieceTestEngine(state);
  }

  getState(): MatchState {
    return this.state;
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

  findCardInZone(
    seat: MatchSeat,
    zone: "hand" | "life" | "trash" | "deck" | "character",
    cardId: string,
  ): string {
    const player = this.state.players[seat];
    const pool =
      zone === "character"
        ? player.characterArea.filter((entry): entry is string => Boolean(entry))
        : player[zone];
    const instanceId = pool.find((candidate) => this.state.cards[candidate]?.cardId === cardId);

    if (!instanceId) {
      throw new Error(`Could not find ${cardId} in ${seat} ${zone}.`);
    }

    return instanceId;
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

  attachDon(targetId: CardRef, amount = 1, seat: MatchSeat = this.state.activeSeat) {
    return this.exec({
      type: "attachDon",
      seat,
      targetId,
      amount,
    });
  }

  declareAttack(attackerId: CardRef, targetId: CardRef, seat: MatchSeat = this.state.activeSeat) {
    return this.exec({
      type: "declareAttack",
      seat,
      attackerId,
      targetId,
    });
  }

  activateEffect(
    sourceInstanceId: CardRef,
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
    return this.exec({ type: "startGame", seat });
  }

  endTurn(seat: MatchSeat = this.state.activeSeat) {
    return this.exec({ type: "endTurn", seat });
  }
}
