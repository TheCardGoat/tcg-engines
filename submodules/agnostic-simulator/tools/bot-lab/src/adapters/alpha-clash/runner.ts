import {
  createSemanticCycleDetector,
  stableBotHash,
  type BotMatchRecordV1,
  type BotTerminationReason,
} from "@tcg/bot-core";
import {
  applyCommand,
  createInitialState,
  type AcCommand,
  type DeckConfig,
  type MatchState,
} from "../../../../../../alpha-clash/packages/engine/src/index.ts";
import { alphaClashBotCommandCandidates } from "../../../../../packages/alpha-clash/alpha-clash-server-adapter/src/bot.ts";
import { clashStepSeat } from "../../../../../packages/alpha-clash/alpha-clash-server-adapter/src/alpha-clash-server-engine.ts";
import {
  alphaClashHeuristicCommand,
  ALPHA_CLASH_HEURISTICS,
  type AlphaClashHeuristics,
} from "./policy.ts";
import { candidateWinner } from "../shared.ts";

export interface AlphaClashRunInput {
  readonly blockId: string;
  readonly legId: string;
  readonly seed: string;
  readonly candidateSeat: "p1" | "p2";
  readonly candidateDeckId: string;
  readonly baselineDeckId: string;
  readonly candidateDeck: DeckConfig;
  readonly baselineDeck: DeckConfig;
  readonly maxActions?: number;
  readonly candidateStrategyId?: string;
  readonly baselineStrategyId?: string;
  readonly candidateOverrides?: Partial<AlphaClashHeuristics>;
  /** Read-only observation after setup and each accepted public command. */
  readonly observe?: (state: MatchState, command?: AcCommand) => void;
}

function stateHash(state: MatchState): string {
  // Logs and their counter do not establish game progress. The complete
  // gameplay state (including choices and turn-local counters) does.
  const ids = new Set(Object.values(state.cards).map((card) => card.definitionId));
  const definitions = Object.fromEntries([...ids].sort().map((id) => [id, state.definitions[id]]));
  return stableBotHash({ ...state, definitions, moveLog: [], nextLogNumber: 0 });
}

/** Runs the existing practice policy through the same public command boundary as the server. */
export function runAlphaClashPracticeMatch(input: AlphaClashRunInput): BotMatchRecordV1 {
  const candidateIsP1 = input.candidateSeat === "p1";
  const state = createInitialState({
    id: `${input.blockId}/${input.legId}`,
    seed: Number.parseInt(stableBotHash(input.seed).split(":")[1]!, 16),
    firstPlayer: "player-one",
    players: {
      "player-one": { name: "P1", deck: candidateIsP1 ? input.candidateDeck : input.baselineDeck },
      "player-two": { name: "P2", deck: candidateIsP1 ? input.baselineDeck : input.candidateDeck },
    },
  });
  const detector = createSemanticCycleDetector();
  input.observe?.(state);
  let termination: BotTerminationReason = "max-actions";
  let actions = 0;
  let illegalProposals = 0;
  const maxActions = input.maxActions ?? 1_500;
  while (state.phase.name !== "complete" && actions < maxActions) {
    if (detector.observe(stateHash(state)).repeated) {
      termination = "repeated-state";
      break;
    }
    const seat = clashStepSeat(state) ?? state.activePlayer;
    const isCandidate = (seat === "player-one") === candidateIsP1;
    const strategyId =
      (isCandidate ? input.candidateStrategyId : input.baselineStrategyId) ?? "practice-v1";
    const config = ALPHA_CLASH_HEURISTICS[strategyId];
    const heuristic = config
      ? alphaClashHeuristicCommand(state, seat, {
          ...config,
          ...(isCandidate ? input.candidateOverrides : {}),
        })
      : undefined;
    const commands = config
      ? heuristic
        ? [heuristic]
        : []
      : alphaClashBotCommandCandidates(state, seat);
    let applied = false;
    for (const command of commands) {
      const result = applyCommand(state, command);
      if (result.success) {
        applied = true;
        actions++;
        input.observe?.(state, command);
        break;
      }
      illegalProposals++;
    }
    if (!applied) {
      termination = state.pendingChoices.length ? "unsupported-prompt" : "illegal-command";
      break;
    }
  }
  let winnerIsP1: boolean | null = null;
  if (state.phase.name === "complete") {
    winnerIsP1 = state.phase.winner === "player-one";
    termination =
      state.phase.reason === "decked"
        ? "deck-out"
        : state.phase.reason === "concede"
          ? "player-concession"
          : "rules-win";
  }
  return {
    blockId: input.blockId,
    legId: input.legId,
    seed: input.seed,
    candidateSeat: input.candidateSeat,
    candidateDeckId: input.candidateDeckId,
    baselineDeckId: input.baselineDeckId,
    winner: candidateWinner({ winnerIsP1, candidateSeat: input.candidateSeat }),
    termination,
    turnCount: state.turnNumber,
    actionCount: actions,
    finalStateHash: stateHash(state),
    diagnostics: { illegalProposals },
  };
}
