import {
  apply,
  current,
  isDraft,
  makeCreator,
  rawReturn,
  type Draft,
  type Patches,
} from "mutative";
import type { FabMatchState } from "./state.ts";

const runtimeProcess = globalThis as {
  readonly process?: { readonly env?: { readonly NODE_ENV?: string } };
};
const strictDrafts = runtimeProcess.process?.env?.NODE_ENV !== "production";

const immutableFabContexts = new WeakSet<object>();
const activeFabCommandStates = new WeakSet<FabMatchState>();
const ownedFabCommandCandidates = new WeakSet<FabMatchState>();

function registerFabImmutableContext(state: Readonly<FabMatchState>): void {
  immutableFabContexts.add(state.cardDefinitions);
  immutableFabContexts.add(state.publicCardIdentities as object);
}

function markFabImmutableContext(
  target: object,
  types: { readonly immutable: "immutable" },
): "immutable" | undefined {
  return immutableFabContexts.has(target) ? types.immutable : undefined;
}

/**
 * FAB's single copy-on-write boundary.
 *
 * Patches are deliberately disabled: the server persists the published state,
 * and failed transactions roll back by discarding their unpublished candidate.
 */
const createFabState = makeCreator({
  enablePatches: false,
  enableAutoFreeze: false,
  strict: strictDrafts,
  mark: markFabImmutableContext,
});

/** Event preparation needs a replayable delta for safe publication into an outer draft. */
const prepareFabState = makeCreator({
  enablePatches: true,
  enableAutoFreeze: false,
  strict: strictDrafts,
  mark: markFabImmutableContext,
});

export interface FabCopyOnWriteSample {
  readonly durationMs: number;
}

let copyOnWriteObserver: ((sample: FabCopyOnWriteSample) => void) | null = null;

/** Local profiling hook. Production dispatch does not install an observer. */
export function observeFabCopyOnWrite(
  observer: ((sample: FabCopyOnWriteSample) => void) | null,
): void {
  copyOnWriteObserver = observer;
}

export type FabStateDraft = Draft<FabMatchState>;

export function isFabStateDraft(value: object): value is FabStateDraft {
  return isDraft(value);
}

/** Consume the one-shot zero-copy serialization privilege for a detached command candidate. */
export function consumeOwnedFabCommandCandidate(value: object): value is FabMatchState {
  const state = value as FabMatchState;
  if (!ownedFabCommandCandidates.has(state)) return false;
  ownedFabCommandCandidates.delete(state);
  return true;
}

/** Read-only current value of an outer transaction draft for event preparation. */
export function currentFabState(base: object): Readonly<FabMatchState> {
  return (isDraft(base) ? current(base as FabStateDraft) : base) as Readonly<FabMatchState>;
}

/** Publish only a fully validated prepared delta into the owning batch draft. */
export function applyPreparedFabState(draft: FabStateDraft, patches: Patches): void {
  if (activeFabCommandStates.has(draft as FabMatchState)) {
    apply(draft, patches, { mutable: true });
    return;
  }
  apply(draft, patches);
}

/** Build an unpublished event candidate without opening another observed command boundary. */
export function prepareFabStateWithResult<Result>(
  base: Readonly<FabMatchState>,
  prepare: (draft: FabStateDraft) => Result,
): { readonly state: FabMatchState; readonly patches: Patches; readonly result: Result } {
  registerFabImmutableContext(base);
  let result: Result | undefined;
  const [state, patches] = prepareFabState(
    base as FabMatchState,
    (draft) => {
      result = prepare(draft as FabStateDraft);
    },
    { enablePatches: true },
  );
  if (result === undefined) {
    throw new Error("FAB state preparation did not produce a result.");
  }
  return { state, patches, result };
}

/**
 * Run a fallible nested transition behind a command-local savepoint.
 *
 * A rejected result or exception leaves the owning command candidate exactly
 * unchanged. Accepted state is copied into that candidate only after the
 * nested transition has completed, preserving the outer root identity used by
 * command handlers.
 */
export function mutateFabStateSavepointWithResult<Result extends { readonly accepted: boolean }>(
  base: Readonly<FabMatchState>,
  mutate: (draft: FabStateDraft) => Result,
): { readonly state: FabMatchState; readonly result: Result } {
  const hasOwningCommand = activeFabCommandStates.has(base as FabMatchState);
  const { cardDefinitions, publicCardIdentities, ...mutableState } = base;
  const candidate: FabMatchState = {
    ...structuredClone(mutableState),
    cardDefinitions,
    publicCardIdentities,
  };
  activeFabCommandStates.add(candidate);
  try {
    const result = mutate(candidate as FabStateDraft);
    if (!result.accepted) return { state: base as FabMatchState, result };
    if (!hasOwningCommand) return { state: candidate, result };
    // Fold the accepted savepoint into the owning command candidate through
    // the standard in-place mutator — the fold is the only place a savepoint
    // publishes into its command, and it never changes the candidate identity.
    mutateInPlace(base, (draft) => {
      Object.assign(draft, candidate);
    });
    return { state: base as FabMatchState, result };
  } finally {
    activeFabCommandStates.delete(candidate);
  }
}

/**
 * Own one detached mutable candidate for a complete public command.
 *
 * A long-lived proxy draft made rules scans more than three times slower in
 * the real-deck benchmark. The mutable portion is therefore copied once while
 * the immutable match program stays structurally shared. Mutative still owns
 * the single outer replacement/finalization, and nested state helpers reuse
 * the command-owned candidate directly.
 */
export function mutateCommandState<Result>(
  base: Readonly<FabMatchState>,
  mutate: (state: FabMatchState) => Result,
): { readonly state: FabMatchState; readonly result: Result } {
  const { cardDefinitions, publicCardIdentities, ...mutableState } = base;
  const candidate: FabMatchState = {
    ...structuredClone(mutableState),
    cardDefinitions,
    publicCardIdentities,
  };
  let result: Result | undefined;
  const startedAt = copyOnWriteObserver ? performance.now() : 0;
  try {
    const state = createFabState(
      base as FabMatchState,
      () => {
        activeFabCommandStates.add(candidate);
        try {
          result = mutate(candidate);
        } finally {
          activeFabCommandStates.delete(candidate);
        }
        return rawReturn(candidate);
      },
      // The recipe intentionally never reads or mutates the proxy: it returns
      // the already-detached command candidate as the single root replacement.
      { strict: false },
    );
    if (result === undefined) {
      throw new Error("FAB command mutation did not produce its command-local result.");
    }
    ownedFabCommandCandidates.add(state);
    return { state, result };
  } finally {
    if (copyOnWriteObserver) {
      copyOnWriteObserver({ durationMs: performance.now() - startedAt });
    }
  }
}

/**
 * The single nested state mutation entry — the `mutateInPlace` half of the
 * two-name mutation vocabulary.
 *
 * When called with a draft or a command-owned candidate it mutates that
 * document in place (preserving the identity the runtime publishes); a
 * detached base gets its own copy-on-write candidate. Nested helpers never
 * return a different object identity for the command-owned case. The outer
 * envelope is {@link mutateCommandState}; the savepoint helper
 * ({@link mutateFabStateSavepointWithResult}) is the fallible-transaction
 * exception, and {@link prepareFabStateWithResult} is the patch-publication
 * path used by event journals (it never mutates the candidate directly).
 */
export function mutateInPlace(
  base: Readonly<FabMatchState>,
  mutate: (draft: FabMatchState) => void,
): FabMatchState {
  // A transaction may call a helper while it already owns the atomic group
  // draft. Re-entering Mutative here would finalize an unnecessary nested
  // candidate and defeat structural sharing for that group.
  if (isDraft(base)) {
    mutate(base as FabMatchState);
    return base as FabMatchState;
  }
  if (activeFabCommandStates.has(base as FabMatchState)) {
    mutate(base as FabMatchState);
    return base as FabMatchState;
  }
  registerFabImmutableContext(base);
  if (!copyOnWriteObserver) {
    return createFabState(base as FabMatchState, (draft) => mutate(draft as FabMatchState));
  }
  const startedAt = performance.now();
  try {
    return createFabState(base as FabMatchState, (draft) => mutate(draft as FabMatchState));
  } finally {
    copyOnWriteObserver({ durationMs: performance.now() - startedAt });
  }
}
