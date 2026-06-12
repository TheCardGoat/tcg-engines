import { apply, type Patch } from "mutative";
import type { PersistedReplayData } from "./fetch";
import type { ExtractedTurn } from "./turn-extractor";
import type { ResolvedCard } from "./card-resolver";

export interface RenderInput {
  replay: PersistedReplayData;
  turn: number;
  extracted: ExtractedTurn;
  resolvedCards: Map<string, ResolvedCard>;
}

interface PendingSelectionView {
  pendingEffectId: unknown;
  pendingEffectKind: unknown;
  sourceCardId: unknown;
  chooserId: unknown;
  selectionContext: unknown;
}

function extractPendingSelections(state: unknown): PendingSelectionView[] {
  if (!state || typeof state !== "object") return [];
  const g = (state as { G?: unknown }).G;
  if (!g || typeof g !== "object") return [];
  const pending = (g as { pendingEffects?: unknown }).pendingEffects;
  if (!Array.isArray(pending)) return [];
  const out: PendingSelectionView[] = [];
  for (const pe of pending) {
    if (!pe || typeof pe !== "object") continue;
    const peObj = pe as Record<string, unknown>;
    if (peObj.selectionContext === undefined) continue;
    out.push({
      pendingEffectId: peObj.id,
      pendingEffectKind: peObj.kind,
      sourceCardId: peObj.sourceCardId ?? peObj.sourceId,
      chooserId: peObj.chooserId ?? peObj.controllerId,
      selectionContext: peObj.selectionContext,
    });
  }
  return out;
}

function pushPendingSelectionsBlock(
  lines: string[],
  label: string,
  selections: PendingSelectionView[],
): void {
  lines.push(label);
  if (selections.length === 0) {
    lines.push("(none — no pending player selection at this point)");
    return;
  }
  for (const sel of selections) {
    lines.push(JSON.stringify(sel));
  }
}

export function renderTurn(input: RenderInput): string {
  const { replay, turn, extracted, resolvedCards } = input;
  const lines: string[] = [];

  lines.push(`=== REPLAY ${replay.gameId} · TURN ${turn} ===`);
  lines.push(
    `gameType=${replay.gameType} matchId=${replay.matchId} totalSteps=${replay.steps.length} totalTurns=${replay.metadata.totalTurns} totalMoves=${replay.metadata.totalMoves}`,
  );
  lines.push(`players=${replay.playerIds.join(" vs ")}`);
  lines.push("");

  // CARDS INVOLVED
  lines.push("--- CARDS INVOLVED ---");
  const byDef = new Map<string, { resolved: ResolvedCard; instances: string[] }>();
  for (const instId of extracted.involvedInstanceIds) {
    const defId = extracted.cardInstances[instId];
    if (!defId) continue;
    const resolved = resolvedCards.get(defId);
    if (!resolved) continue;
    let entry = byDef.get(defId);
    if (!entry) {
      entry = { resolved, instances: [] };
      byDef.set(defId, entry);
    }
    entry.instances.push(instId);
  }
  if (byDef.size === 0) {
    lines.push("(no card instances detected in this turn)");
  } else {
    const entries = [...byDef.values()].sort((a, b) =>
      a.resolved.fullName.localeCompare(b.resolved.fullName),
    );
    for (const { resolved, instances } of entries) {
      const filePath = resolved.filePath ?? "(no file resolved)";
      lines.push(`${resolved.defId}  ${resolved.fullName}  ${filePath}`);
      lines.push(`  instances: ${instances.join(", ")}`);
    }
  }
  lines.push("");

  // INITIAL STATE
  lines.push(`--- INITIAL STATE (before turn ${turn}) ---`);
  lines.push(JSON.stringify(extracted.preTurnState, null, 2));
  lines.push("");

  // PENDING SELECTIONS (pre-turn)
  pushPendingSelectionsBlock(
    lines,
    `--- PENDING SELECTIONS (before turn ${turn}) ---`,
    extractPendingSelections(extracted.preTurnState),
  );
  lines.push("");

  // STEPS
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
      for (const p of step.patches) lines.push(`  ${JSON.stringify(p)}`);
    }
    // Advance the running state and surface any pending player selection
    // that exists *after* this step resolves. This is what diagnoses
    // targeting bugs: it shows the candidate set the engine offered to
    // the next chooser, against which the player's actual input (in the
    // following step) can be compared.
    const patches = step.patches as Patch[];
    if (Array.isArray(patches) && patches.length > 0) {
      try {
        state = apply(state as object, patches);
      } catch (err) {
        lines.push(
          `pendingSelections: (state reconstruction failed at step ${globalIndex}: ${(err as Error).message})`,
        );
        lines.push("");
        continue;
      }
    }
    const post = extractPendingSelections(state);
    if (post.length === 0) {
      lines.push("pendingSelections: []");
    } else {
      lines.push("pendingSelections:");
      for (const sel of post) lines.push(`  ${JSON.stringify(sel)}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
