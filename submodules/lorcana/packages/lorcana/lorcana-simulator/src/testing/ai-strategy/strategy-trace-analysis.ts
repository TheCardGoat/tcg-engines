import { readFileSync } from "node:fs";
import type { AutomatedActionDecisionTrace } from "@tcg/lorcana-engine";
import type { StrategyDecisionLogEntry } from "./strategy-suite.js";

export type MatchTraceSummary = {
  actions: number;
  abnormalFallbacks: number;
  concedeFallbacks: number;
  finalLore: Record<string, number>;
  questionableDecisions: number;
  signalDiagnostics: number;
  topFamilies: Record<string, number>;
};

export type SignalDiagnosticEntry = {
  detail: string;
  kind: string;
  moveNumber: number;
  turnNumber: number;
};

function isNormalPassTurnFallback(entry: AutomatedActionDecisionTrace): boolean {
  return entry.fallbackTaken === "passTurn" && entry.orderedCandidates.length === 0;
}

function countChallengeOverQuest(entry: AutomatedActionDecisionTrace): boolean {
  return (
    entry.selectedCandidate?.family === "challenge" &&
    entry.orderedCandidates.some((candidate) => candidate.family === "quest")
  );
}

export function summarizeMatchTraceFile(path: string): MatchTraceSummary {
  const lines = readFileSync(path, "utf8").trim().split("\n").filter(Boolean);
  const entries = lines.map((line) => JSON.parse(line) as StrategyDecisionLogEntry);

  let abnormalFallbacks = 0;
  let concedeFallbacks = 0;
  let signalDiagnostics = 0;
  let questionableDecisions = 0;
  const topFamilies: Record<string, number> = {};
  let finalLore: Record<string, number> = {};

  for (const entry of entries) {
    if (entry.fallbackTaken && !isNormalPassTurnFallback(entry)) {
      abnormalFallbacks += 1;
    }
    if (entry.fallbackTaken === "concede") {
      concedeFallbacks += 1;
    }

    signalDiagnostics += entry.unsupportedSkips.length + entry.validationSkips.length;

    if (countChallengeOverQuest(entry)) {
      questionableDecisions += 1;
    }

    if (entry.selectedCandidate) {
      const family = entry.selectedCandidate.family;
      topFamilies[family] = (topFamilies[family] ?? 0) + 1;
    }

    finalLore = entry.boardSnapshot.loreTotals as Record<string, number>;
  }

  return {
    actions: entries.length,
    abnormalFallbacks,
    concedeFallbacks,
    finalLore,
    questionableDecisions,
    signalDiagnostics,
    topFamilies,
  };
}

export function findSignalDiagnosticsInFile(path: string): SignalDiagnosticEntry[] {
  const lines = readFileSync(path, "utf8").trim().split("\n").filter(Boolean);
  const entries = lines.map((line) => JSON.parse(line) as StrategyDecisionLogEntry);
  const results: SignalDiagnosticEntry[] = [];

  for (const entry of entries) {
    for (const skip of entry.unsupportedSkips) {
      results.push({
        detail: "description" in skip ? String(skip.description) : skip.kind,
        kind: skip.kind,
        moveNumber: entry.moveNumber,
        turnNumber: entry.turnNumber,
      });
    }

    for (const skip of entry.validationSkips) {
      results.push({
        detail: "description" in skip ? String(skip.description) : skip.kind,
        kind: skip.kind,
        moveNumber: entry.moveNumber,
        turnNumber: entry.turnNumber,
      });
    }
  }

  return results;
}
