import { applyCommand, createMatch, getLegalCommands } from "../core.ts";
import type { EngineCommand, MatchConfig, MatchSeat, MatchState, PromptState } from "../types.ts";
import type { OnePieceBotStrategy } from "./bot-strategies.ts";
import {
  createSemanticCycleDetector,
  stableBotHash,
  type BotTerminationReason,
} from "@tcg/bot-core";
import { createRandomAPI } from "@tcg/engine-core";

export interface BotMatchResult {
  winner: MatchSeat | null;
  totalCommands: number;
  illegalCommands: number;
  stuck: boolean;
  termination: BotTerminationReason;
  finalState: MatchState;
  commandHistory: EngineCommand[];
  logHistory: string[];
}

export interface TelemetryEntry {
  turn: number;
  phase: string;
  activeSeat: MatchSeat;
  commandType: string;
  accepted: boolean;
  reason: string | null;
  illegal: boolean;
}

export function resolveBotPromptCommand(
  state: MatchState,
  prompt: PromptState,
): EngineCommand | null {
  const seat = prompt.seat as MatchSeat;

  if (prompt.kind === "judge") {
    return {
      type: "judgeResolvePrompt",
      seat: "judge",
      promptId: prompt.id,
      note: "Bot auto-resolved judge prompt.",
    };
  }

  let optionId: string | undefined;
  let selectedIds: string[] | undefined;

  if (prompt.choiceKind === "confirm") {
    const yesOption = prompt.options.find((o) => o.id === "yes" || o.id === "activate");
    optionId = yesOption?.id ?? prompt.options[0]?.id;
  } else if (prompt.choiceKind === "selectCards" || prompt.choiceKind === "selectTargets") {
    const count = Math.min(prompt.maxSelections, prompt.minSelections);
    selectedIds = prompt.options.slice(0, count).map((o) => o.id);
  } else if (prompt.choiceKind === "costPayment") {
    const count = Math.max(prompt.minSelections, 1);
    selectedIds = prompt.options.slice(0, count).map((o) => o.id);
  }

  if (optionId === undefined && selectedIds === undefined) {
    optionId = prompt.options[0]?.id;
  }

  return {
    type: "resolvePrompt",
    seat,
    promptId: prompt.id,
    optionId,
    selectedIds,
  };
}

function drainPendingPrompts(
  state: MatchState,
  telemetry: TelemetryEntry[],
  commandHistory: EngineCommand[],
): { state: MatchState; illegalCommands: number } {
  let current = state;
  let illegalCommands = 0;
  for (let safety = 0; safety < 50; safety++) {
    const prompt = current.promptQueue.find((p) => p.status === "pending");
    if (!prompt) break;

    const command = resolveBotPromptCommand(current, prompt);
    if (!command) break;

    const result = applyCommand(current, command);
    commandHistory.push(command);
    telemetry.push({
      turn: current.turnNumber,
      phase: current.phase,
      activeSeat: current.activeSeat,
      commandType: command.type,
      accepted: result.accepted,
      reason: result.reason,
      illegal: !result.accepted,
    });

    if (!result.accepted) {
      illegalCommands++;
      break;
    }
    current = result.state;
  }
  return { state: current, illegalCommands };
}

export function runBotMatch(
  config: MatchConfig,
  strategies: Record<MatchSeat, OnePieceBotStrategy>,
  options: { maxCommands?: number; seed?: string | number } = {},
): BotMatchResult {
  const maxCommands = options.maxCommands ?? 500;
  let state = createMatch(config);
  const commandHistory: EngineCommand[] = [];
  const telemetry: TelemetryEntry[] = [];
  let illegalCommands = 0;
  let termination: BotTerminationReason = "max-actions";
  const random = createRandomAPI(String(options.seed ?? config.seed ?? "one-piece-bot"));
  const cycleDetector = createSemanticCycleDetector();

  for (let step = 0; step < maxCommands; step++) {
    if (state.status === "finished") {
      termination = "rules-win";
      break;
    }

    const drained = drainPendingPrompts(state, telemetry, commandHistory);
    state = drained.state;
    illegalCommands += drained.illegalCommands;
    if (drained.illegalCommands > 0) {
      termination = "illegal-command";
      break;
    }

    if (state.status === "finished") {
      termination = "rules-win";
      break;
    }

    const semanticFingerprint = stableBotHash(
      JSON.parse(
        JSON.stringify(state, (key, value) =>
          key === "idCounter" || key === "commandHistory" || key === "logHistory"
            ? undefined
            : value,
        ),
      ),
    );
    if (cycleDetector.observe(semanticFingerprint).repeated) {
      termination = "repeated-state";
      break;
    }

    const legal =
      state.status === "setup"
        ? [...getLegalCommands(state, "south"), ...getLegalCommands(state, "north")]
        : getLegalCommands(state);
    const pendingPrompts = state.promptQueue.filter((p) => p.status === "pending");

    if (pendingPrompts.length > 0) {
      const prompt = pendingPrompts[0]!;
      const command = resolveBotPromptCommand(state, prompt);
      if (command) {
        const result = applyCommand(state, command);
        telemetry.push({
          turn: state.turnNumber,
          phase: state.phase,
          activeSeat: state.activeSeat,
          commandType: command.type,
          accepted: result.accepted,
          reason: result.reason,
          illegal: !result.accepted,
        });
        if (!result.accepted) {
          illegalCommands++;
        }
        commandHistory.push(command);
        state = result.state;
        continue;
      }
    }

    const setupActor = legal
      .map((descriptor) => descriptor.seat)
      .find((seat): seat is MatchSeat => seat === "south" || seat === "north");
    const activeSeat = state.status === "setup" && setupActor ? setupActor : state.activeSeat;
    const strategy = strategies[activeSeat];
    const myLegal = legal.filter((c) => c.seat === activeSeat);

    if (myLegal.length === 0) {
      termination = "unsupported-prompt";
      break;
    }

    const chosen = strategy(state, activeSeat, myLegal, { random: () => random.random() });
    if (!chosen) {
      const endTurn = myLegal.find((c) => c.type === "endTurn");
      if (endTurn) {
        const cmd: EngineCommand = { type: "endTurn", seat: activeSeat };
        const result = applyCommand(state, cmd);
        telemetry.push({
          turn: state.turnNumber,
          phase: state.phase,
          activeSeat,
          commandType: cmd.type,
          accepted: result.accepted,
          reason: result.reason,
          illegal: !result.accepted,
        });
        if (!result.accepted) {
          illegalCommands++;
          termination = "illegal-command";
        }
        commandHistory.push(cmd);
        state = result.state;
        if (!result.accepted) break;
        continue;
      }
      termination = "unsupported-prompt";
      break;
    }

    const result = applyCommand(state, chosen);
    telemetry.push({
      turn: state.turnNumber,
      phase: state.phase,
      activeSeat,
      commandType: chosen.type,
      accepted: result.accepted,
      reason: result.reason,
      illegal: !result.accepted,
    });
    if (!result.accepted) {
      illegalCommands++;
      termination = "illegal-command";
    }
    commandHistory.push(chosen);
    state = result.state;
    if (!result.accepted) break;
  }

  const stuck = state.status !== "finished" && state.winner === null;

  return {
    winner: state.winner,
    totalCommands: commandHistory.length,
    illegalCommands,
    stuck,
    termination,
    finalState: state,
    commandHistory,
    logHistory: state.logHistory.map((l) => l.message),
  };
}
