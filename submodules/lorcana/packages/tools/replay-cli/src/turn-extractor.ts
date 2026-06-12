import { apply, type Patch } from "mutative";
import type { PersistedReplayData, PersistedReplayStep } from "./fetch";

export interface ExtractedTurn {
  preTurnState: unknown;
  turnSteps: Array<{ globalIndex: number; step: PersistedReplayStep }>;
  involvedInstanceIds: string[];
  /**
   * Effective `instanceId → definitionId` mapping for the replay. Merges the
   * top-level `replay.cardsMaps.cardInstances` with any `cardsMaps` embedded
   * inside the `initialState` envelope (legacy `engineSnapshot` shapes), with
   * top-level taking precedence on conflicts. Use this — not
   * `replay.cardsMaps.cardInstances` directly — when resolving defIds.
   */
  cardInstances: Record<string, string>;
}

interface ParsedInitial {
  /** Inner LorcanaMatchState that the persisted patches are scoped against. */
  state: object;
  /** `cardsMaps` discovered inside the envelope, if any (legacy snapshots). */
  embeddedCardsMaps?: { cardInstances?: Record<string, string> };
}

/**
 * Unwrap the various initialState envelopes used over the life of the replay
 * format and return the inner LorcanaMatchState plus any embedded cardsMaps.
 * Mirrors the simulator's `parseReplayInitialState` + `extractMatchState`
 * logic so the CLI agrees with the in-app player.
 *
 * Recognised shapes (in priority order):
 *   1. `{ state: <inner>, historyLength, ... }`           v2 server-authority
 *   2. `{ state: <inner>, cardInstances, owners, ... }`   v2 client-authority
 *      (no historyLength)
 *   3. `{ state, cardsMaps, historyLength }`              legacy EngineSnapshot
 *      — `cardsMaps` is captured and returned as `embeddedCardsMaps`
 *   4. `{ state: { engineSnapshot: { state, cardsMaps } } }` very old client
 *      authority — recurse and capture the embedded `cardsMaps`
 *   5. `{ ctx, ... }`                                     direct match state
 */
function parseInitialState(raw: string): ParsedInitial {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (err) {
    throw new Error(`Replay initialState is not valid JSON: ${(err as Error).message}`);
  }

  const isStateObject = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object" && !Array.isArray(v);

  let embeddedCardsMaps: ParsedInitial["embeddedCardsMaps"];

  const captureCardsMaps = (value: Record<string, unknown>) => {
    if (embeddedCardsMaps) return;
    const cm = value.cardsMaps;
    if (isStateObject(cm) && isStateObject(cm.cardInstances)) {
      embeddedCardsMaps = {
        cardInstances: cm.cardInstances as Record<string, string>,
      };
    }
  };

  const unwrap = (value: unknown, depth: number): object | null => {
    if (depth > 4 || !isStateObject(value)) return null;

    // Direct match state — has ctx, no further wrapping.
    if ("ctx" in value && isStateObject(value.ctx)) {
      return value;
    }

    // `{ state: ..., cardsMaps?: ..., engineSnapshot?: ... }`. Capture
    // sibling cardsMaps before recursing into `state`. This covers legacy
    // EngineSnapshot (`{ state, cardsMaps, historyLength }`) and the very
    // old client-authority `{ state: { engineSnapshot: { state, cardsMaps } } }`
    // form (where the cardsMaps sits next to the inner state).
    if ("state" in value && isStateObject(value.state)) {
      captureCardsMaps(value);
      const inner = unwrap(value.state, depth + 1);
      if (inner) return inner;
      return value.state;
    }

    // `{ engineSnapshot: { state, cardsMaps } }` at the root.
    if ("engineSnapshot" in value && isStateObject(value.engineSnapshot)) {
      captureCardsMaps(value.engineSnapshot);
      return unwrap(value.engineSnapshot, depth + 1);
    }

    return null;
  };

  const inner = unwrap(parsed, 0);
  if (!inner) {
    throw new Error(
      `Replay initialState did not unwrap to a recognised match-state shape (got ${parsed === null ? "null" : typeof parsed})`,
    );
  }
  return { state: inner, embeddedCardsMaps };
}

export function extractTurn(replay: PersistedReplayData, turn: number): ExtractedTurn {
  const turnSteps: Array<{ globalIndex: number; step: PersistedReplayStep }> = [];
  let firstIdx = -1;
  for (let i = 0; i < replay.steps.length; i++) {
    const step = replay.steps[i]!;
    if (step.acceptedMove.turnNumber === turn) {
      if (firstIdx === -1) firstIdx = i;
      turnSteps.push({ globalIndex: i, step });
    }
  }

  if (turnSteps.length === 0) {
    const turns = new Set(replay.steps.map((s) => s.acceptedMove.turnNumber));
    const sorted = [...turns].sort((a, b) => a - b);
    throw new Error(
      `No steps found for turn ${turn}. Available turns: ${sorted.join(", ") || "(none)"}`,
    );
  }

  const parsed = parseInitialState(replay.initialState);

  // Apply all patches up to (but not including) the first step of the requested turn.
  let state: object = parsed.state;
  for (let i = 0; i < firstIdx; i++) {
    const step = replay.steps[i]!;
    const patches = step.patches as Patch[];
    if (!Array.isArray(patches) || patches.length === 0) continue;
    try {
      state = apply(state, patches) as object;
    } catch (err) {
      throw new Error(
        `Failed to apply patches at step ${i} (turn ${step.acceptedMove.turnNumber}, move ${step.acceptedMove.moveId}) while reconstructing pre-turn state: ${(err as Error).message}`,
      );
    }
  }

  // Merge top-level cardInstances with any embedded map. Top-level wins on
  // conflicts. For legacy client-authority replays the top-level map is
  // empty (only the embedded one inside engineSnapshot is populated), so
  // without this fall-back `--- CARDS INVOLVED ---` would be empty.
  const cardInstances: Record<string, string> = {
    ...parsed.embeddedCardsMaps?.cardInstances,
    ...replay.cardsMaps?.cardInstances,
  };

  const knownInstances = new Set(Object.keys(cardInstances));
  const involved = new Set<string>();

  const visit = (root: unknown) => {
    const stack: unknown[] = [root];
    while (stack.length > 0) {
      const value = stack.pop();
      if (value == null) continue;
      if (typeof value === "string") {
        if (knownInstances.has(value)) involved.add(value);
        continue;
      }
      if (Array.isArray(value)) {
        for (const v of value) stack.push(v);
        continue;
      }
      if (typeof value === "object") {
        for (const v of Object.values(value as Record<string, unknown>)) stack.push(v);
      }
    }
  };

  for (const { step } of turnSteps) {
    visit(step.patches);
    visit(step.logs);
    visit(step.acceptedMove.input);
  }

  return {
    preTurnState: state,
    turnSteps,
    involvedInstanceIds: [...involved].sort(),
    cardInstances,
  };
}
