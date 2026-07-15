import { apply, type Patch } from "mutative";
import type { PersistedReplayData } from "./fetch.ts";
import type { ExtractedTurn } from "./turn-extractor.ts";
import type { ResolvedCard } from "./card-resolver.ts";

export interface RenderInput {
  replay: PersistedReplayData;
  turn: number;
  extracted: ExtractedTurn;
  resolvedCards: Map<string, ResolvedCard>;
}

export function renderReplaySummary(replay: PersistedReplayData): string {
  const lines: string[] = [];
  const turns = new Map<number, { steps: number; moves: Map<string, number> }>();

  for (const step of replay.steps) {
    const turn = step.acceptedMove.turnNumber;
    const entry = turns.get(turn) ?? { steps: 0, moves: new Map<string, number>() };
    entry.steps += 1;
    entry.moves.set(step.acceptedMove.moveId, (entry.moves.get(step.acceptedMove.moveId) ?? 0) + 1);
    turns.set(turn, entry);
  }

  lines.push(`=== CYBERPUNK REPLAY ${replay.gameId} ===`);
  lines.push(
    `gameType=${replay.gameType} matchId=${replay.matchId} totalSteps=${replay.steps.length} totalTurns=${replay.metadata.totalTurns} totalMoves=${replay.metadata.totalMoves}`,
  );
  lines.push(`players=${replay.playerIds.join(" vs ")}`);
  lines.push(
    `winner=${replay.metadata.winnerId ?? "(none)"} endReason=${replay.metadata.endReason ?? "(none)"}`,
  );
  lines.push("");
  lines.push("--- AVAILABLE TURNS ---");

  if (turns.size === 0) {
    lines.push("(none)");
  } else {
    for (const [turn, entry] of [...turns.entries()].sort((a, b) => a[0] - b[0])) {
      const moveSummary = [...entry.moves.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([moveId, count]) => `${moveId}=${count}`)
        .join(", ");
      lines.push(
        `turn ${turn}: ${entry.steps} step${entry.steps === 1 ? "" : "s"} (${moveSummary})`,
      );
    }
  }

  lines.push("");
  lines.push("Run with --turn <n> to print the detailed pre-turn state, cards, logs, and patches.");
  return lines.join("\n");
}

interface PendingChoiceView {
  type: unknown;
  chooserId: unknown;
  payload: unknown;
}

function extractPendingChoice(state: unknown): PendingChoiceView | null {
  if (!state || typeof state !== "object") return null;
  const g = (state as { G?: unknown }).G;
  if (!g || typeof g !== "object") return null;
  const turnMetadata = (g as { turnMetadata?: unknown }).turnMetadata;
  if (!turnMetadata || typeof turnMetadata !== "object") return null;
  const pendingChoice = (turnMetadata as { pendingChoice?: unknown }).pendingChoice;
  if (!pendingChoice || typeof pendingChoice !== "object") return null;
  const choice = pendingChoice as Record<string, unknown>;
  return {
    type: choice.type,
    chooserId: choice.chooserId,
    payload: choice.payload,
  };
}

function pushPendingChoiceBlock(lines: string[], label: string, choice: PendingChoiceView | null) {
  lines.push(label);
  lines.push(choice ? JSON.stringify(choice) : "(none - no pending player choice at this point)");
}

export function renderTurn(input: RenderInput): string {
  const { replay, turn, extracted, resolvedCards } = input;
  const lines: string[] = [];

  lines.push(`=== CYBERPUNK REPLAY ${replay.gameId} · TURN ${turn} ===`);
  lines.push(
    `gameType=${replay.gameType} matchId=${replay.matchId} totalSteps=${replay.steps.length} totalTurns=${replay.metadata.totalTurns} totalMoves=${replay.metadata.totalMoves}`,
  );
  lines.push(`players=${replay.playerIds.join(" vs ")}`);
  lines.push("");

  lines.push("--- CARDS INVOLVED ---");
  const byDef = new Map<string, { resolved: ResolvedCard; instances: string[] }>();
  for (const instId of extracted.involvedInstanceIds) {
    const defId = extracted.cardInstances[instId];
    if (!defId) continue;
    const resolved = resolvedCards.get(defId);
    if (!resolved) continue;
    const entry = byDef.get(defId) ?? { resolved, instances: [] };
    entry.instances.push(instId);
    byDef.set(defId, entry);
  }
  if (byDef.size === 0) {
    lines.push("(no card instances detected in this turn)");
  } else {
    const entries = [...byDef.values()].sort((a, b) =>
      a.resolved.displayName.localeCompare(b.resolved.displayName),
    );
    for (const { resolved, instances } of entries) {
      lines.push(
        `${resolved.defId}  ${resolved.displayName}  ${resolved.filePath ?? "(no file resolved)"}`,
      );
      lines.push(`  instances: ${instances.join(", ")}`);
    }
  }
  lines.push("");

  lines.push(`--- INITIAL STATE (before turn ${turn}) ---`);
  lines.push(JSON.stringify(extracted.preTurnState, null, 2));
  lines.push("");

  pushPendingChoiceBlock(
    lines,
    `--- PENDING CHOICE (before turn ${turn}) ---`,
    extractPendingChoice(extracted.preTurnState),
  );
  lines.push("");

  lines.push("--- STEPS ---");
  let state: unknown = extracted.preTurnState;
  for (const { globalIndex, step } of extracted.turnSteps) {
    const move = step.acceptedMove;
    lines.push(`[step ${globalIndex} · turn ${turn} · actor ${move.actorId}]`);
    lines.push(`move:    ${move.moveId} input=${JSON.stringify(move.input ?? null)}`);
    if (step.logs.length === 0) {
      lines.push("logs:    []");
    } else {
      lines.push("logs:");
      for (const log of step.logs) lines.push(`  ${JSON.stringify(log)}`);
    }
    if (step.patches.length === 0) {
      lines.push("patches: []");
    } else {
      lines.push("patches:");
      for (const patch of step.patches) lines.push(`  ${JSON.stringify(patch)}`);
    }

    const patches = step.patches as Patch[];
    if (Array.isArray(patches) && patches.length > 0) {
      try {
        state = apply(state as object, patches);
      } catch (err) {
        lines.push(
          `pendingChoice: (state reconstruction failed at step ${globalIndex}: ${(err as Error).message})`,
        );
        lines.push("");
        continue;
      }
    }

    const post = extractPendingChoice(state);
    lines.push(`pendingChoice: ${post ? JSON.stringify(post) : "null"}`);
    lines.push("");
  }

  return lines.join("\n");
}
