import { useMemo, useSyncExternalStore } from "react";

export type LiveTransitionSource = "authoritative" | "sync";

export type LiveTransitionStatus = "queued" | "animating";

export interface LiveStateTransition<TState, TAnimation = unknown> {
  id: string;
  correlationId?: string;
  fromState: TState;
  toState: TState;
  fromVersion: number;
  toVersion: number;
  source: LiveTransitionSource;
  animationPlan: readonly TAnimation[];
  status: LiveTransitionStatus;
}

export interface LiveTransitionSnapshot<TState, TAnimation = unknown> {
  authoritativeState: TState | null;
  authoritativeVersion: number | null;
  displayState: TState | null;
  displayVersion: number | null;
  activeTransition: LiveStateTransition<TState, TAnimation> | null;
  queuedTransitions: readonly LiveStateTransition<TState, TAnimation>[];
}

export interface HydrateAuthoritativeStateInput<TState> {
  state: TState;
  version: number;
}

export interface EnqueueAuthoritativeUpdateInput<TState, TAnimation> {
  state: TState;
  version: number;
  correlationId?: string;
  animationPlan?: readonly TAnimation[];
  source?: LiveTransitionSource;
}

export interface LiveTransitionController<TState, TAnimation = unknown> {
  getSnapshot(this: void): LiveTransitionSnapshot<TState, TAnimation>;
  subscribe(this: void, listener: () => void): () => void;
  hydrateAuthoritativeState(input: HydrateAuthoritativeStateInput<TState>): void;
  enqueueAuthoritativeUpdate(input: EnqueueAuthoritativeUpdateInput<TState, TAnimation>): void;
  markAnimationComplete(transitionId: string): void;
  clear(): void;
}

export function createLiveTransitionController<
  TState,
  TAnimation = unknown,
>(): LiveTransitionController<TState, TAnimation> {
  let snapshot: LiveTransitionSnapshot<TState, TAnimation> = emptySnapshot();
  const listeners = new Set<() => void>();

  function setSnapshot(next: LiveTransitionSnapshot<TState, TAnimation>): void {
    snapshot = next;
    for (const listener of listeners) {
      listener();
    }
  }

  function activateNext(
    current: LiveTransitionSnapshot<TState, TAnimation>,
  ): LiveTransitionSnapshot<TState, TAnimation> {
    if (current.activeTransition || current.queuedTransitions.length === 0) {
      return current;
    }

    const [nextTransition, ...remaining] = current.queuedTransitions;
    if (!nextTransition) {
      return current;
    }

    if (nextTransition.animationPlan.length === 0) {
      return activateNext({
        ...current,
        displayState: nextTransition.toState,
        displayVersion: nextTransition.toVersion,
        queuedTransitions: remaining,
      });
    }

    return {
      ...current,
      activeTransition: { ...nextTransition, status: "animating" },
      queuedTransitions: remaining,
    };
  }

  function enqueueTransition(
    transition: LiveStateTransition<TState, TAnimation>,
    current = snapshot,
  ): LiveTransitionSnapshot<TState, TAnimation> {
    return activateNext({
      ...current,
      queuedTransitions: [...current.queuedTransitions, transition],
    });
  }

  return {
    getSnapshot: () => snapshot,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    hydrateAuthoritativeState({ state, version }) {
      setSnapshot({
        ...emptySnapshot<TState, TAnimation>(),
        authoritativeState: state,
        authoritativeVersion: version,
        displayState: state,
        displayVersion: version,
      });
    },

    enqueueAuthoritativeUpdate(input) {
      const source = input.source ?? "authoritative";
      const tail = transitionTail(snapshot);
      const fromState =
        tail.state ?? snapshot.displayState ?? snapshot.authoritativeState ?? input.state;
      const fromVersion =
        tail.version ?? snapshot.displayVersion ?? snapshot.authoritativeVersion ?? input.version;
      const nextBase: LiveTransitionSnapshot<TState, TAnimation> = {
        ...snapshot,
        authoritativeState: input.state,
        authoritativeVersion: input.version,
      };

      setSnapshot(
        enqueueTransition(
          {
            id: transitionId(source, input.correlationId, fromVersion, input.version),
            ...(input.correlationId ? { correlationId: input.correlationId } : {}),
            fromState,
            toState: input.state,
            fromVersion,
            toVersion: input.version,
            source,
            animationPlan: input.animationPlan ?? [],
            status: "queued",
          },
          nextBase,
        ),
      );
    },

    markAnimationComplete(transitionIdToComplete) {
      const active = snapshot.activeTransition;
      if (!active || active.id !== transitionIdToComplete) {
        return;
      }
      setSnapshot(
        activateNext({
          ...snapshot,
          displayState: active.toState,
          displayVersion: active.toVersion,
          activeTransition: null,
        }),
      );
    },

    clear() {
      setSnapshot(emptySnapshot());
    },
  };
}

export function useLiveTransitionSnapshot<TState, TAnimation = unknown>(
  controller: LiveTransitionController<TState, TAnimation>,
): LiveTransitionSnapshot<TState, TAnimation> {
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
}

export function useLiveTransitionController<
  TState,
  TAnimation = unknown,
>(): LiveTransitionController<TState, TAnimation> {
  return useMemo(() => createLiveTransitionController<TState, TAnimation>(), []);
}

function emptySnapshot<TState, TAnimation>(): LiveTransitionSnapshot<TState, TAnimation> {
  return {
    authoritativeState: null,
    authoritativeVersion: null,
    displayState: null,
    displayVersion: null,
    activeTransition: null,
    queuedTransitions: [],
  };
}

function transitionTail<TState, TAnimation>(
  snapshot: LiveTransitionSnapshot<TState, TAnimation>,
): { state: TState | null; version: number | null } {
  const queuedTail = snapshot.queuedTransitions.at(-1);
  const tail = queuedTail ?? snapshot.activeTransition;
  return {
    state: tail?.toState ?? null,
    version: tail?.toVersion ?? null,
  };
}

function transitionId(
  source: LiveTransitionSource,
  correlationId: string | undefined,
  fromVersion: number,
  toVersion: number,
): string {
  return `${source}:${correlationId ?? "server"}:${fromVersion}->${toVersion}`;
}
