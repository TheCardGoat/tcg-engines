import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorPlayerSummary, SimulatorPlayersContextValue } from "./types";

export const EMPTY_SIMULATOR_PLAYER_SUMMARY: SimulatorPlayerSummary = {
  participant: null,
  isPremium: false,
  mmr: null,
};

export const EMPTY_SIMULATOR_PLAYERS_CONTEXT: SimulatorPlayersContextValue = {
  currentPlayer: EMPTY_SIMULATOR_PLAYER_SUMMARY,
  opponentPlayer: EMPTY_SIMULATOR_PLAYER_SUMMARY,
  participants: [],
};

export const [SimulatorPlayersContextProvider, useSimulatorPlayers] =
  createRequiredSimulatorContext<SimulatorPlayersContextValue>(EMPTY_SIMULATOR_PLAYERS_CONTEXT);
