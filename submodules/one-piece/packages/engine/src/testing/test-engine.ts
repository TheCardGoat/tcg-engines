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
import { OnePieceTestPlayer } from "./test-player.ts";

export { NORTH, PLAYER_ONE, PLAYER_TWO, SOUTH };
export { OnePieceTestPlayer } from "./test-player.ts";

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

  /**
   * Seat-bound fluent driver for south. Prefer this over trailing `seat`
   * arguments so the IDE autocompletes player actions:
   *
   *   engine.asSouth().attack(mountainGod, engine.asNorth().leader());
   *   engine.asNorth().chooseBlocker(blocker);
   */
  asSouth(): OnePieceTestPlayer {
    return new OnePieceTestPlayer(this, "south");
  }

  /**
   * Seat-bound fluent driver for north. Pair with {@link asSouth} for
   * head-to-head scripts that read as player dialogue.
   */
  asNorth(): OnePieceTestPlayer {
    return new OnePieceTestPlayer(this, "north");
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

  /**
   * When a test resolves a post-confirm intent (cost payment, targets, etc.),
   * auto-accept a leading `effectOptional` for the same seat so happy-path
   * sequences stay user-like ("I pay the DON!!") while decline tests still call
   * `decline()` / `resolveDecision("effectOptional", { optionId: "no" })`.
   */
  /**
   * Explicitly accept leading effectOptional confirms for this seat.
   * Call this before pendingDecision/resolveDecision when a test intentionally
   * skips documenting the optional yes step. pendingDecision itself is read-only.
   */
  acceptLeadingOptional(seat: MatchSeat = this.state.activeSeat, max = 3): void {
    for (let i = 0; i < max; i += 1) {
      const optional = this.state.promptQueue.find(
        (candidate) =>
          candidate.kind === "choice" &&
          candidate.status === "pending" &&
          candidate.seat === seat &&
          candidate.resolutionContext?.intent === "effectOptional",
      );
      if (!optional) return;
      this.exec({
        type: "resolvePrompt",
        seat,
        promptId: optional.id,
        optionId: "yes",
      });
    }
  }

  /** Read-only: project a pending decision. Does not auto-accept prior optionals. */
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
    // When resolving a non-optional intent that is blocked behind effectOptional,
    // auto-accept leading optionals only if the test did not leave them pending
    // for explicit resolution (intent is not effectOptional).
    if (intent !== "effectOptional") {
      const hasTarget = this.state.promptQueue.some(
        (candidate) =>
          candidate.kind === "choice" &&
          candidate.status === "pending" &&
          candidate.seat === seat &&
          candidate.resolutionContext?.intent === intent,
      );
      if (!hasTarget) {
        this.acceptLeadingOptional(seat);
      }
    }
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

  /** Readable alias for ending the turn the way a player does. */
  passTurn(seat: MatchSeat = this.state.activeSeat) {
    return this.endTurn(seat);
  }

  concede(seat: MatchSeat = this.state.activeSeat) {
    return this.exec({ type: "concede", seat });
  }

  /**
   * Play a card from hand (pays DON!!, places it, and runs On Play prompts).
   * This is the primary user action for Character, Event, and Stage cards.
   */
  play(card: CardRef, seat: MatchSeat = this.state.activeSeat, slotIndex?: number) {
    return this.playCard(card, seat, slotIndex);
  }

  /**
   * Activate a Main / Activate: Main ability on a card already on the board
   * (or the Leader). Prefer this over building raw `activateEffect` commands.
   */
  activateMain(source: CardRef | string, seat: MatchSeat = this.state.activeSeat) {
    const sourceInstanceId =
      typeof source === "string" && this.state.cards[source]
        ? source
        : this.findCardOnBoard(seat, source);
    return this.activateEffect(sourceInstanceId, "activateMain", seat);
  }

  /**
   * Choose cards in the current choice prompt the way a player would click
   * targets. Resolves card definitions to live instance IDs on the board/hand.
   */
  choose(
    intent: PromptResolutionContext["intent"],
    cards: Array<CardRef | string>,
    seat: MatchSeat = this.state.activeSeat,
  ) {
    // Happy-path choose skips documenting the optional yes; decline tests use decline().
    if (intent !== "effectOptional") {
      this.acceptLeadingOptional(seat);
    }
    const decision = this.pendingDecision(intent, seat);
    const selectedIds = cards.map((card) => this.resolveCandidateId(decision, card, seat));
    return this.resolveDecision(intent, { selectedIds }, seat);
  }

  /** Accept an optional "you may" prompt (Yes). */
  accept(seat: MatchSeat = this.state.activeSeat) {
    return this.resolveDecision("effectOptional", { optionId: "yes" }, seat);
  }

  /** Decline an optional "you may" prompt (No). */
  decline(seat: MatchSeat = this.state.activeSeat) {
    return this.resolveDecision("effectOptional", { optionId: "no" }, seat);
  }

  /**
   * Pick a numeric option such as "how many DON!! to give" by the printed count.
   * Falls back to optionId matching the amount string.
   */
  chooseAmount(amount: number, seat: MatchSeat = this.state.activeSeat) {
    return this.resolveDecision("effectGiveDonCount", { optionId: String(amount) }, seat);
  }

  /**
   * Declare an attack from one card onto another (Leader or Character).
   * Both references may be card definitions or live instance IDs.
   */
  attack(
    attacker: CardRef | string,
    target: CardRef | string,
    seat: MatchSeat = this.state.activeSeat,
  ) {
    const attackerId =
      typeof attacker === "string" && this.state.cards[attacker]
        ? attacker
        : this.findCardOnBoard(seat, attacker);
    const defenderSeat: MatchSeat = seat === "south" ? "north" : "south";
    const targetId =
      typeof target === "string" && this.state.cards[target]
        ? target
        : this.findCardOnBoard(defenderSeat, target);
    return this.declareAttack(attackerId, targetId, seat);
  }

  /**
   * Whether the player currently has a pending choice prompt that needs a click
   * (optional accept, target selection, etc.). Informational UI is ignored.
   */
  hasPendingChoice(seat: MatchSeat = this.state.activeSeat): boolean {
    return this.state.promptQueue.some(
      (prompt) => prompt.kind === "choice" && prompt.status === "pending" && prompt.seat === seat,
    );
  }

  /** Assert the given card is on the player's field (character area). */
  findOnField(seat: MatchSeat, card: CardRef): string {
    return this.findCardInZone(seat, "character", card);
  }

  private findCardOnBoard(seat: MatchSeat, card: CardRef | string): string {
    if (typeof card === "string" && this.state.cards[card]) {
      return card;
    }
    const cardId = typeof card === "string" ? card : card.id;
    for (const zone of ["character", "leader", "stage", "hand"] as const) {
      try {
        return this.findCardInZone(seat, zone, cardId);
      } catch {
        // try next zone
      }
    }
    throw new Error(`Could not find ${cardId} on ${seat}'s board or hand.`);
  }

  private resolveCandidateId(
    decision: ProjectedDecision,
    card: CardRef | string,
    seat: MatchSeat,
  ): string {
    if (typeof card === "string" && this.state.cards[card]) {
      return card;
    }
    const cardId = typeof card === "string" ? card : card.id;
    for (const step of decision.steps) {
      if (step.kind !== "selectEntity") continue;
      const match = step.candidates.find((candidate) => {
        const instance = this.state.cards[candidate.ref.id];
        return instance?.cardId === cardId || candidate.ref.id === cardId;
      });
      if (match) return match.ref.id;
    }
    // Fall back to board lookup if the prompt has not been projected yet.
    return this.findCardOnBoard(seat, card);
  }
}
