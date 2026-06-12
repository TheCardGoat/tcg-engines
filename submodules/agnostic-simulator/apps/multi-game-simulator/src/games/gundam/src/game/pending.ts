import type { EngineAdapter } from "./adapter.ts";
import type {
  GundamPendingMoveStep,
  MoveName,
  PartialInput,
  PendingState,
  SubmitOutcome,
} from "./types.ts";

export interface PendingController {
  readonly getSnapshot: () => PendingState;
  readonly subscribe: (listener: () => void) => () => void;
  readonly start: (move: MoveName, seed?: PartialInput) => PendingState;
  readonly startForCard: (move: MoveName, cardId: string) => PendingState;
  readonly provide: (key: string, value: unknown) => PendingState;
  readonly provideTarget: (step: GundamPendingMoveStep, cardId: string) => PendingState;
  readonly confirm: () => SubmitOutcome | null;
  readonly cancel: () => void;
}

export function createPendingController(adapter: EngineAdapter): PendingController {
  let state: PendingState = { status: "idle" };
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const computeSteps = (move: MoveName, partial: PartialInput): readonly GundamPendingMoveStep[] =>
    adapter.describeMove(move, partial);

  return {
    getSnapshot: () => state,

    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    start: (move, seed = {}) => {
      state = {
        status: "collecting",
        move,
        partialInput: seed,
        steps: computeSteps(move, seed),
      };
      emit();
      return state;
    },

    startForCard: (move, cardId) => {
      const seed = adapter.seedForCard(move, cardId);
      state = {
        status: "collecting",
        move,
        partialInput: seed,
        steps: computeSteps(move, seed),
      };
      emit();
      return state;
    },

    provide: (key, value) => {
      if (state.status !== "collecting") return state;
      const nextInput = { ...state.partialInput, [key]: value };
      state = {
        status: "collecting",
        move: state.move,
        partialInput: nextInput,
        steps: computeSteps(state.move, nextInput),
      };
      emit();
      return state;
    },

    provideTarget: (step, cardId) => {
      if (state.status !== "collecting") return state;
      const { key, multi } = adapter.keyForStep(state.move, step);
      if (multi) {
        const current = Array.isArray(state.partialInput[key])
          ? (state.partialInput[key] as readonly string[])
          : [];
        const next = current.includes(cardId)
          ? current.filter((id) => id !== cardId)
          : [...current, cardId];
        const nextInput = { ...state.partialInput, [key]: next };
        state = {
          status: "collecting",
          move: state.move,
          partialInput: nextInput,
          steps: computeSteps(state.move, nextInput),
        };
        emit();
        return state;
      }
      const nextInput = { ...state.partialInput, [key]: cardId };
      state = {
        status: "collecting",
        move: state.move,
        partialInput: nextInput,
        steps: computeSteps(state.move, nextInput),
      };
      emit();
      return state;
    },

    confirm: () => {
      if (state.status !== "collecting") return null;
      const outcome = adapter.submit(state.move, state.partialInput);
      // Preserve the collecting state when submit fails so the UI can surface
      // the error and let the player correct the selection without re-building
      // every partial input from scratch. Only clear on success.
      if (outcome.ok) {
        state = { status: "idle" };
        emit();
      }
      return outcome;
    },

    cancel: () => {
      if (state.status === "idle") return;
      state = { status: "idle" };
      emit();
    },
  };
}
