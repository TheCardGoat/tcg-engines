export interface FabPracticeDeferredCommandWork<TSnapshot> {
  readonly correlationId: string;
  readonly snapshot: TSnapshot;
  readonly commitAnalytics: () => void;
  readonly commitTelemetry: () => void;
}

export interface FabPracticeDeferredWorkQueue<TSnapshot> {
  defer(work: FabPracticeDeferredCommandWork<TSnapshot>, waitForSettlement: boolean): void;
  settle(correlationId: string): void;
  coalescePersistence(snapshot: TSnapshot): void;
  flushPageHide(): void;
  pendingCount(): number;
}

interface FabPracticeDeferredWorkQueueOptions<TSnapshot> {
  readonly run: (correlationId: string, stage: "analytics" | "telemetry", work: () => void) => void;
  readonly startTransition: (work: () => void) => void;
  readonly persist: (snapshot: TSnapshot) => void;
  readonly scheduleMicrotask?: (work: () => void) => void;
}

/**
 * Keeps post-command work outside the active motion window. Persistence is
 * last-write-wins within a microtask, while pagehide drains every accepted
 * command synchronously before writing the newest snapshot.
 */
export function createFabPracticeDeferredWorkQueue<TSnapshot>(
  options: FabPracticeDeferredWorkQueueOptions<TSnapshot>,
): FabPracticeDeferredWorkQueue<TSnapshot> {
  const pending = new Map<string, FabPracticeDeferredCommandWork<TSnapshot>>();
  const scheduleMicrotask = options.scheduleMicrotask ?? queueMicrotask;
  let pendingPersistence: TSnapshot | null = null;
  let persistenceScheduled = false;

  const flushPersistence = () => {
    persistenceScheduled = false;
    const snapshot = pendingPersistence;
    pendingPersistence = null;
    if (snapshot !== null) options.persist(snapshot);
  };

  const coalescePersistence = (snapshot: TSnapshot) => {
    pendingPersistence = snapshot;
    if (persistenceScheduled) return;
    persistenceScheduled = true;
    scheduleMicrotask(flushPersistence);
  };

  const settle = (correlationId: string) => {
    const work = pending.get(correlationId);
    if (!work) return;
    pending.delete(correlationId);
    options.run(correlationId, "analytics", work.commitAnalytics);
    options.startTransition(() => options.run(correlationId, "telemetry", work.commitTelemetry));
    coalescePersistence(work.snapshot);
  };

  return {
    defer(work, waitForSettlement) {
      pending.set(work.correlationId, work);
      if (!waitForSettlement) scheduleMicrotask(() => settle(work.correlationId));
    },
    settle,
    coalescePersistence,
    flushPageHide() {
      for (const work of pending.values()) {
        options.run(work.correlationId, "analytics", work.commitAnalytics);
        options.run(work.correlationId, "telemetry", work.commitTelemetry);
        pendingPersistence = work.snapshot;
      }
      pending.clear();
      flushPersistence();
    },
    pendingCount: () => pending.size,
  };
}
