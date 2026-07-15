import type { Transport, TransportMessage } from "../types/transport.ts";

export class InMemoryTransport implements Transport {
  private handlers: Set<(msg: TransportMessage) => void> = new Set();
  private partner: InMemoryTransport | null = null;

  send(message: TransportMessage): void {
    this.partner?.receive(message);
  }

  onMessage(handler: (message: TransportMessage) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  close(): void {
    this.handlers.clear();
    this.partner = null;
  }

  private receive(message: TransportMessage): void {
    for (const handler of this.handlers) {
      handler(message);
    }
  }

  static createPair(): [InMemoryTransport, InMemoryTransport] {
    const a = new InMemoryTransport();
    const b = new InMemoryTransport();
    a.partner = b;
    b.partner = a;
    return [a, b];
  }
}
