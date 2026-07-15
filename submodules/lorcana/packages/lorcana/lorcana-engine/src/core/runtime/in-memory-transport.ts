import type { ClientMessage, ConnectionState, ServerMessage, Transport } from "./protocol-types";
import { getLogger } from "@logtape/logtape";

const logger = getLogger(["core-engine", "in-memory-transport"]);

// =============================================================================
// In-Memory Transport
// =============================================================================

export interface InMemoryTransportPair {
  identifier?: string;
  client: InMemoryTransport;
  server: InMemoryTransport;
}

export type BrowserTransportMode = "sync" | "async";
export type BrowserTransportLatencyModel = "rtt" | "one-way";

export interface BrowserTransportConfig {
  mode: BrowserTransportMode;
  latencyMs?: number;
  latencyModel?: BrowserTransportLatencyModel;
}

export type NormalizedBrowserTransportConfig =
  | { mode: "sync" }
  | { mode: "async"; latencyMs: number; latencyModel: BrowserTransportLatencyModel };

export interface InMemoryTransportScheduledTask {
  cancel(): void;
}

export interface InMemoryTransportScheduler {
  schedule(delayMs: number, task: () => void): InMemoryTransportScheduledTask;
}

export interface InMemoryTransportOptions {
  browserTransport?: BrowserTransportConfig;
  scheduler?: InMemoryTransportScheduler;
}

type PendingDelivery = {
  delayMs: number;
  deliver: () => void;
};

type ManualScheduledEntry = {
  id: number;
  runAt: number;
  task: () => void;
  cancelled: boolean;
};

const DEFAULT_ASYNC_BROWSER_TRANSPORT = {
  mode: "async",
  latencyMs: 250,
  latencyModel: "rtt",
} satisfies Extract<NormalizedBrowserTransportConfig, { mode: "async" }>;

class TimeoutScheduledTask implements InMemoryTransportScheduledTask {
  constructor(private timeoutId: ReturnType<typeof setTimeout>) {}

  cancel(): void {
    clearTimeout(this.timeoutId);
  }
}

class DefaultInMemoryTransportScheduler implements InMemoryTransportScheduler {
  schedule(delayMs: number, task: () => void): InMemoryTransportScheduledTask {
    return new TimeoutScheduledTask(setTimeout(task, delayMs));
  }
}

class ManualTransportScheduledTask implements InMemoryTransportScheduledTask {
  constructor(private entry: ManualScheduledEntry) {}

  cancel(): void {
    this.entry.cancelled = true;
  }
}

export class ManualInMemoryTransportScheduler implements InMemoryTransportScheduler {
  private nowMs = 0;
  private nextId = 1;
  private queue: ManualScheduledEntry[] = [];

  schedule(delayMs: number, task: () => void): InMemoryTransportScheduledTask {
    const entry: ManualScheduledEntry = {
      id: this.nextId++,
      runAt: this.nowMs + Math.max(0, delayMs),
      task,
      cancelled: false,
    };
    this.queue.push(entry);
    this.queue.sort((left, right) => {
      if (left.runAt !== right.runAt) {
        return left.runAt - right.runAt;
      }
      return left.id - right.id;
    });
    return new ManualTransportScheduledTask(entry);
  }

  advanceBy(durationMs: number): void {
    const targetTime = this.nowMs + Math.max(0, durationMs);
    const maxTasksToProcess = Math.max(this.queue.length * 2, 1_000);

    for (let processedTasks = 0; processedTasks < maxTasksToProcess; processedTasks += 1) {
      const nextEntry = this.queue.find((entry) => !entry.cancelled && entry.runAt <= targetTime);
      if (!nextEntry) {
        break;
      }

      this.queue = this.queue.filter((entry) => entry !== nextEntry);
      this.nowMs = nextEntry.runAt;
      nextEntry.task();
    }

    const hasRemainingRunnableTask = this.queue.some(
      (entry) => !entry.cancelled && entry.runAt <= targetTime,
    );
    if (hasRemainingRunnableTask) {
      throw new Error(
        `Exceeded ${maxTasksToProcess} scheduled tasks while advancing transport time to ${targetTime}ms.`,
      );
    }

    this.nowMs = targetTime;
    this.queue = this.queue.filter((entry) => !entry.cancelled);
  }
}

export function normalizeBrowserTransportConfig(
  config?: BrowserTransportConfig | null,
): NormalizedBrowserTransportConfig {
  if (!config || config.mode !== "async") {
    return { mode: "sync" };
  }

  const latencyMs =
    typeof config.latencyMs === "number" &&
    Number.isFinite(config.latencyMs) &&
    config.latencyMs >= 0
      ? config.latencyMs
      : DEFAULT_ASYNC_BROWSER_TRANSPORT.latencyMs;
  const latencyModel = config.latencyModel === "one-way" ? "one-way" : "rtt";

  return {
    mode: "async",
    latencyMs,
    latencyModel,
  };
}

function isAsyncClientIngress(message: ClientMessage | ServerMessage): boolean {
  return message.type === "UPDATE_ACTION" || message.type === "UNDO_REQUEST";
}

function isAsyncServerEgress(message: ClientMessage | ServerMessage): boolean {
  return (
    message.type === "UPDATE_FULL" || message.type === "UPDATE_PATCH" || message.type === "ERROR"
  );
}

export class InMemoryTransport implements Transport {
  private state: ConnectionState = "DISCONNECTED";
  private pairedTransport: InMemoryTransport | null = null;
  private readonly browserTransport: NormalizedBrowserTransportConfig;
  private readonly scheduler: InMemoryTransportScheduler;
  private pendingDeliveries: PendingDelivery[] = [];
  private activeDelivery: InMemoryTransportScheduledTask | null = null;

  private messageHandler: ((message: ServerMessage) => void) | null = null;
  private disconnectHandler: ((reason: string) => void) | null = null;
  private errorHandler: ((error: Error) => void) | null = null;

  constructor(options: InMemoryTransportOptions = {}) {
    this.browserTransport = normalizeBrowserTransportConfig(options.browserTransport);
    this.scheduler = options.scheduler ?? new DefaultInMemoryTransportScheduler();
  }

  /**
   * Pair this transport with another for bidirectional communication.
   */
  pairWith(other: InMemoryTransport): void {
    this.pairedTransport = other;
    other.pairedTransport = this;
  }

  async connect(): Promise<void> {
    this.state = "CONNECTED";
  }

  async disconnect(skipLog: boolean = true): Promise<void> {
    this.state = "DISCONNECTED";
    this.activeDelivery?.cancel();
    this.activeDelivery = null;
    this.pendingDeliveries = [];
    this.pairedTransport?.disconnectHandler?.("Remote disconnected");

    if (!skipLog) {
      logger.info("InMemoryTransport Disconnected!");
    }
  }

  send(message: ClientMessage): void {
    if (this.state !== "CONNECTED") {
      this.errorHandler?.(new Error("Not connected"));
      return;
    }

    this.dispatchToPeer(message);
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.messageHandler = handler;
  }

  onDisconnect(handler: (reason: string) => void): void {
    this.disconnectHandler = handler;
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandler = handler;
  }

  getState(): ConnectionState {
    return this.state;
  }

  // =============================================================================
  // Test Utilities
  // =============================================================================

  /**
   * Simulate receiving a message from the remote side.
   * Routes the message to the paired transport's handler.
   */
  simulateReceive(message: ServerMessage): void {
    this.dispatchToPeer(message);
  }

  /**
   * Simulate a disconnect.
   */
  simulateDisconnect(reason: string): void {
    this.state = "DISCONNECTED";
    this.activeDelivery?.cancel();
    this.activeDelivery = null;
    this.pendingDeliveries = [];
    this.disconnectHandler?.(reason);
  }

  /**
   * Simulate an error.
   */
  simulateError(error: Error): void {
    this.state = "ERROR";
    this.errorHandler?.(error);
  }

  private dispatchToPeer(message: ClientMessage | ServerMessage): void {
    const delayMs = this.resolveDelayMs(message);
    const shouldYieldToScheduler =
      this.browserTransport.mode === "async" &&
      (isAsyncClientIngress(message) || isAsyncServerEgress(message));
    const deliver = () => {
      this.pairedTransport?.messageHandler?.(message as unknown as ServerMessage);
    };

    if (!shouldYieldToScheduler && delayMs <= 0) {
      deliver();
      return;
    }

    this.pendingDeliveries.push({ delayMs, deliver });
    this.scheduleNextDelivery();
  }

  private resolveDelayMs(message: ClientMessage | ServerMessage): number {
    if (this.browserTransport.mode !== "async") {
      return 0;
    }

    if (!isAsyncClientIngress(message) && !isAsyncServerEgress(message)) {
      return 0;
    }

    return this.browserTransport.latencyModel === "rtt"
      ? this.browserTransport.latencyMs / 2
      : this.browserTransport.latencyMs;
  }

  private scheduleNextDelivery(): void {
    if (this.activeDelivery || this.pendingDeliveries.length === 0) {
      return;
    }

    const nextDelivery = this.pendingDeliveries[0];
    this.activeDelivery = this.scheduler.schedule(nextDelivery.delayMs, () => {
      this.activeDelivery = null;
      this.pendingDeliveries.shift()?.deliver();
      this.scheduleNextDelivery();
    });
  }
}

// =============================================================================
// Transport Pair Factory
// =============================================================================

/**
 * Create a pair of connected in-memory transports.
 * Both transports are immediately set to CONNECTED state.
 */
export function createInMemoryTransportPair(
  options: InMemoryTransportOptions = {},
): InMemoryTransportPair {
  const client = new InMemoryTransport(options);
  const server = new InMemoryTransport(options);
  client.pairWith(server);

  // Set both to connected immediately since this is for testing
  client.connect();
  server.connect();

  return { client, server };
}
