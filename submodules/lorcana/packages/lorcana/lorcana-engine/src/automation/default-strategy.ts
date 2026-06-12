import type {
  AutomatedActionCandidate,
  AutomatedActionCandidateSummary,
  AutomatedActionPlanningContext,
} from "./types";
import {
  AGGRESSIVE_BOARD_CONTROL_LORE_RACE_HEURISTIC_PREFERENCES,
  BOARD_CONTROL_LORE_RACE_HEURISTIC_PREFERENCES,
  DEFAULT_LORE_RACE_HEURISTIC_PREFERENCES,
  LEGACY_LORE_RACE_HEURISTIC_PREFERENCES,
  createLoreRaceAutomatedActionStrategy,
  summarizeLoreRaceCandidates,
} from "./strategy";

export function summarizeLegacyLoreRaceCandidates(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
): AutomatedActionCandidateSummary[] {
  return summarizeLoreRaceCandidates(context, candidates, LEGACY_LORE_RACE_HEURISTIC_PREFERENCES);
}

export function summarizeDefaultLoreRaceCandidates(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
): AutomatedActionCandidateSummary[] {
  return summarizeLoreRaceCandidates(context, candidates, DEFAULT_LORE_RACE_HEURISTIC_PREFERENCES);
}

export function summarizeBoardControlLoreRaceCandidates(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
): AutomatedActionCandidateSummary[] {
  return summarizeLoreRaceCandidates(
    context,
    candidates,
    BOARD_CONTROL_LORE_RACE_HEURISTIC_PREFERENCES,
  );
}

export function summarizeAggressiveBoardControlLoreRaceCandidates(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
): AutomatedActionCandidateSummary[] {
  return summarizeLoreRaceCandidates(
    context,
    candidates,
    AGGRESSIVE_BOARD_CONTROL_LORE_RACE_HEURISTIC_PREFERENCES,
  );
}

export const legacyLoreRaceAutomatedActionStrategy = createLoreRaceAutomatedActionStrategy(
  "legacy-lore-race",
  summarizeLegacyLoreRaceCandidates,
);

export const defaultLoreRaceAutomatedActionStrategy = createLoreRaceAutomatedActionStrategy(
  "default-lore-race",
  summarizeDefaultLoreRaceCandidates,
);

export const boardControlLoreRaceAutomatedActionStrategy = createLoreRaceAutomatedActionStrategy(
  "board-control-lore-race",
  summarizeBoardControlLoreRaceCandidates,
);

export const aggressiveBoardControlLoreRaceAutomatedActionStrategy =
  createLoreRaceAutomatedActionStrategy(
    "aggressive-board-control-lore-race",
    summarizeAggressiveBoardControlLoreRaceCandidates,
  );
