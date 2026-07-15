import { emitEvent, emitLog, getPlayer, normalizeConfig } from "../shared.ts";
import { buildInitialPlayerState, formatCardList } from "../state.ts";
import type { MatchConfig, MatchState } from "../types.ts";

export function createMatch(config: MatchConfig): MatchState {
  const normalizedConfig = normalizeConfig(config);
  const state: MatchState = {
    config: normalizedConfig,
    status: "setup",
    activeSeat: normalizedConfig.firstPlayer,
    turnNumber: 1,
    phase: "setup",
    players: {} as MatchState["players"],
    cards: {},
    modifiers: {},
    promptQueue: [],
    battle: null,
    winner: null,
    setup: {
      started: false,
      joKenPo: {
        round: 1,
        pendingSeats: [],
        hiddenChoices: {},
        choices: {},
        winner: null,
        firstPlayerDecided: false,
      },
      mulliganUsed: {
        north: false,
        south: false,
      },
      mulliganDecided: {
        north: false,
        south: false,
      },
    },
    idCounter: 0,
    eventSequence: 0,
    logSequence: 0,
    capabilitySequence: 0,
    eventHistory: [],
    logHistory: [],
    capabilityHistory: [],
    resolutionQueue: [],
    resolutionStatus: "idle",
    commandHistory: [],
  };

  buildInitialPlayerState(state, "north", normalizedConfig);
  buildInitialPlayerState(state, "south", normalizedConfig);

  emitEvent(state, "matchCreated", "system", {
    visibility: "public",
    data: {
      firstPlayer: normalizedConfig.firstPlayer,
    },
  });

  emitLog(state, "system", normalizedConfig.shuffleDecks ? "Decks shuffled." : "Decks prepared.", {
    visibility: "public",
  });
  emitLog(
    state,
    "system",
    `Leaders placed: ${getPlayer(state, "south").playerName} and ${getPlayer(state, "north").playerName}.`,
    {
      visibility: "public",
    },
  );

  for (const seat of ["north", "south"] as const) {
    emitLog(
      state,
      "system",
      `${getPlayer(state, seat).playerName} places ${getPlayer(state, seat).life.length} Life card${getPlayer(state, seat).life.length === 1 ? "" : "s"}.`,
      {
        visibility: "public",
      },
    );
    emitLog(
      state,
      "system",
      `${getPlayer(state, seat).playerName} draws ${normalizedConfig.openingHandSize} opening cards.`,
      {
        visibility: "private",
        privateMessages: {
          [seat]: `Cards drawn: ${formatCardList(state, getPlayer(state, seat).hand)}.`,
        },
        judgeMessage: `${getPlayer(state, seat).playerName} opening hand: ${formatCardList(state, getPlayer(state, seat).hand)}.`,
      },
    );
  }

  return state;
}
