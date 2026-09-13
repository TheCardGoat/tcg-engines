import type { AnimationPlanV2 } from "@tcg/protocol/animations";

import type { SimulatorAnimationDiagnosticListener } from "./diagnostics.js";

export type AnimationPhase = "preparing" | "running" | "reflowing";
export type AnimationTransitionSource = "authoritative" | "local" | "sync";

export interface SimulatorTransition<TState> {
  readonly id: string;
  readonly correlationId?: string;
  readonly source: AnimationTransitionSource;
  readonly fromState: TState;
  readonly toState: TState;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly plan: AnimationPlanV2;
  readonly phase: AnimationPhase;
}

export interface QueuedSimulatorTransition<TState> extends Omit<
  SimulatorTransition<TState>,
  "plan" | "phase"
> {
  readonly plan: AnimationPlanV2 | null;
}

export interface SimulatorAnimationSnapshot<TState> {
  readonly authoritativeState: TState | null;
  readonly authoritativeVersion: number | null;
  readonly settledState: TState | null;
  readonly settledVersion: number | null;
  readonly presentationState: TState | null;
  readonly presentationVersion: number | null;
  readonly activeTransition: SimulatorTransition<TState> | null;
  readonly queuedTransitions: readonly QueuedSimulatorTransition<TState>[];
}

export interface EnqueueSimulatorAnimationInput<TState> {
  readonly state: TState;
  readonly version: number;
  readonly plan: AnimationPlanV2 | null;
  readonly correlationId?: string;
  readonly source?: Exclude<AnimationTransitionSource, "sync">;
}

export interface SimulatorAnimationStore<TState> {
  getSnapshot(this: void): SimulatorAnimationSnapshot<TState>;
  subscribe(this: void, listener: () => void): () => void;
  hydrate(input: { state: TState; version: number }): void;
  enqueue(input: EnqueueSimulatorAnimationInput<TState>): boolean;
  startActive(transitionId: string): void;
  beginReflow(transitionId: string): void;
  finishActive(transitionId: string): void;
  skipActive(reason: string): void;
  refreshFromProjection(input: { state: TState; version: number }): boolean;
  replaceFromSync(input: { state: TState; version: number }): void;
  reset(): void;
  whenIdle(timeoutMs?: number): Promise<"idle" | "timeout">;
}

export function createSimulatorAnimationStore<TState>(options?: {
  readonly onDiagnostic?: SimulatorAnimationDiagnosticListener;
}): SimulatorAnimationStore<TState> {
  let snapshot = emptySnapshot<TState>();
  const listeners = new Set<() => void>();
  const idleWaiters = new Set<() => void>();

  function publish(
    next: Omit<SimulatorAnimationSnapshot<TState>, "settledState" | "settledVersion">,
  ): void {
    snapshot = {
      ...next,
      settledState: next.activeTransition?.fromState ?? next.presentationState,
      settledVersion: next.activeTransition?.fromVersion ?? next.presentationVersion,
    };
    for (const listener of listeners) listener();
    if (!snapshot.activeTransition && snapshot.queuedTransitions.length === 0) {
      for (const resolve of idleWaiters) resolve();
      idleWaiters.clear();
    }
  }

  function activateNext(next: SimulatorAnimationSnapshot<TState>): void {
    let current = next;
    while (!current.activeTransition && current.queuedTransitions.length > 0) {
      const [head, ...remaining] = current.queuedTransitions;
      if (!head) break;
      if (!head.plan || head.plan.steps.length === 0) {
        current = {
          ...current,
          presentationState: head.toState,
          presentationVersion: head.toVersion,
          queuedTransitions: remaining,
        };
        continue;
      }
      current = {
        ...current,
        activeTransition: { ...head, plan: head.plan, phase: "preparing" },
        queuedTransitions: remaining,
      };
    }
    publish(current);
  }

  const store: SimulatorAnimationStore<TState> = {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    hydrate({ state, version }) {
      publish({
        authoritativeState: state,
        authoritativeVersion: version,
        presentationState: state,
        presentationVersion: version,
        activeTransition: null,
        queuedTransitions: [],
      });
    },
    enqueue(input) {
      const authoritativeVersion = snapshot.authoritativeVersion;
      if (authoritativeVersion !== null && input.version <= authoritativeVersion) {
        options?.onDiagnostic?.({
          type: "stale-update",
          receivedVersion: input.version,
          authoritativeVersion,
        });
        return false;
      }
      const tail = snapshot.queuedTransitions.at(-1) ?? snapshot.activeTransition;
      const fromState =
        tail?.toState ??
        snapshot.presentationState ??
        snapshot.settledState ??
        snapshot.authoritativeState ??
        input.state;
      const fromVersion =
        tail?.toVersion ??
        snapshot.presentationVersion ??
        snapshot.settledVersion ??
        snapshot.authoritativeVersion ??
        input.version;
      const source = input.source ?? "authoritative";
      const transition: QueuedSimulatorTransition<TState> = {
        id: transitionId(source, input.correlationId, fromVersion, input.version),
        ...(input.correlationId ? { correlationId: input.correlationId } : {}),
        source,
        fromState,
        toState: input.state,
        fromVersion,
        toVersion: input.version,
        plan: input.plan,
      };
      activateNext({
        ...snapshot,
        authoritativeState: input.state,
        authoritativeVersion: input.version,
        queuedTransitions: [...snapshot.queuedTransitions, transition],
      });
      return true;
    },
    startActive(id) {
      const active = snapshot.activeTransition;
      if (!active || active.id !== id || active.phase !== "preparing") return;
      publish({
        ...snapshot,
        presentationState: active.toState,
        presentationVersion: active.toVersion,
        activeTransition: { ...active, phase: "running" },
      });
    },
    beginReflow(id) {
      const active = snapshot.activeTransition;
      if (!active || active.id !== id || active.phase !== "running") return;
      publish({ ...snapshot, activeTransition: { ...active, phase: "reflowing" } });
    },
    finishActive(id) {
      const active = snapshot.activeTransition;
      if (!active || active.id !== id) return;
      activateNext({
        ...snapshot,
        presentationState: active.toState,
        presentationVersion: active.toVersion,
        activeTransition: null,
      });
    },
    skipActive(reason) {
      const active = snapshot.activeTransition;
      if (!active) return;
      options?.onDiagnostic?.({ type: "cancelled", transitionId: active.id, reason });
      store.finishActive(active.id);
    },
    refreshFromProjection({ state, version }) {
      if (snapshot.authoritativeVersion !== version) return false;
      publish({
        ...snapshot,
        authoritativeState: state,
        presentationState:
          snapshot.presentationVersion === version ? state : snapshot.presentationState,
        activeTransition: snapshot.activeTransition
          ? refreshTransitionState(snapshot.activeTransition, state, version)
          : null,
        queuedTransitions: snapshot.queuedTransitions.map((transition) =>
          refreshTransitionState(transition, state, version),
        ),
      });
      return true;
    },
    replaceFromSync({ state, version }) {
      const active = snapshot.activeTransition;
      if (active) {
        options?.onDiagnostic?.({
          type: "cancelled",
          transitionId: active.id,
          reason: "sync",
        });
      }
      publish({
        authoritativeState: state,
        authoritativeVersion: version,
        presentationState: state,
        presentationVersion: version,
        activeTransition: null,
        queuedTransitions: [],
      });
    },
    reset() {
      publish(emptySnapshot());
    },
    whenIdle(timeoutMs) {
      if (!snapshot.activeTransition && snapshot.queuedTransitions.length === 0) {
        return Promise.resolve("idle");
      }
      return new Promise((resolve) => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const finish = () => {
          if (timer) clearTimeout(timer);
          idleWaiters.delete(finish);
          resolve("idle");
        };
        idleWaiters.add(finish);
        if (timeoutMs !== undefined) {
          timer = setTimeout(() => {
            idleWaiters.delete(finish);
            resolve("timeout");
          }, timeoutMs);
        }
      });
    },
  };

  return store;
}

function refreshTransitionState<TState, TTransition extends QueuedSimulatorTransition<TState>>(
  transition: TTransition,
  state: TState,
  version: number,
): TTransition {
  if (transition.fromVersion !== version && transition.toVersion !== version) return transition;
  return {
    ...transition,
    ...(transition.fromVersion === version ? { fromState: state } : {}),
    ...(transition.toVersion === version ? { toState: state } : {}),
  };
}

function emptySnapshot<TState>(): SimulatorAnimationSnapshot<TState> {
  return {
    authoritativeState: null,
    authoritativeVersion: null,
    settledState: null,
    settledVersion: null,
    presentationState: null,
    presentationVersion: null,
    activeTransition: null,
    queuedTransitions: [],
  };
}

function transitionId(
  source: AnimationTransitionSource,
  correlationId: string | undefined,
  fromVersion: number,
  toVersion: number,
): string {
  return `${source}:${correlationId ?? "state"}:${fromVersion}->${toVersion}`;
}
