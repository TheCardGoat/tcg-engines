import { apply, type Patch } from "mutative";
import type { PersistedReplayData, PersistedReplayStep } from "./fetch.ts";

export interface ExtractedTurn {
  preTurnState: unknown;
  turnSteps: Array<{ globalIndex: number; step: PersistedReplayStep }>;
  involvedInstanceIds: string[];
  cardInstances: Record<string, string>;
}

interface ParsedInitial {
  state: object;
  embeddedCardsMaps?: { cardInstances?: Record<string, string> };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function captureCardsMaps(value: Record<string, unknown>): ParsedInitial["embeddedCardsMaps"] {
  const cardsMaps = value.cardsMaps;
  if (!isRecord(cardsMaps) || !isRecord(cardsMaps.cardInstances)) return undefined;
  return { cardInstances: cardsMaps.cardInstances as Record<string, string> };
}

function parseInitialState(raw: string): ParsedInitial {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (err) {
    throw new Error(`Replay initialState is not valid JSON: ${(err as Error).message}`);
  }

  let embeddedCardsMaps: ParsedInitial["embeddedCardsMaps"];

  const unwrap = (value: unknown, depth: number): object | null => {
    if (depth > 4 || !isRecord(value)) return null;

    if ("G" in value && isRecord(value.G) && "ctx" in value && isRecord(value.ctx)) {
      return value;
    }

    if ("state" in value && isRecord(value.state)) {
      embeddedCardsMaps ??= captureCardsMaps(value);
      const inner = unwrap(value.state, depth + 1);
      return inner ?? value.state;
    }

    if ("engineSnapshot" in value && isRecord(value.engineSnapshot)) {
      embeddedCardsMaps ??= captureCardsMaps(value.engineSnapshot);
      return unwrap(value.engineSnapshot, depth + 1);
    }

    return null;
  };

  const inner = unwrap(parsed, 0);
  if (!inner) {
    throw new Error(
      `Replay initialState did not unwrap to a recognised Cyberpunk match-state shape (got ${parsed === null ? "null" : typeof parsed})`,
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
        for (const item of value) stack.push(item);
        continue;
      }
      if (typeof value === "object") {
        for (const item of Object.values(value as Record<string, unknown>)) stack.push(item);
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
