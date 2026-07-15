import type { Transport, TransportMessage } from "./types.ts";

export class InMemoryTransport implements Transport {
  private handlers: Set<(message: TransportMessage) => void> = new Set();
  private messageLog: TransportMessage[] = [];

  send(message: TransportMessage): void {
    this.messageLog.push(message);
    for (const handler of this.handlers) {
      handler(message);
    }
  }

  onMessage(handler: (message: TransportMessage) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  close(): void {
    this.handlers.clear();
  }

  getMessages(): TransportMessage[] {
    return this.messageLog;
  }

  clearMessages(): void {
    this.messageLog = [];
  }
}
