/**
 * Minimal EventEmitter shim for browser compatibility.
 * Provides only the essential methods (on, off, emit) needed by the simulator.
 * Does not implement the full Node.js EventEmitter API (missing: once, removeListener,
 * removeAllListeners, listenerCount, prependListener, etc.).
 */
type EventHandler = (...args: unknown[]) => void;

export class EventEmitter {
  #listeners = new Map<string, Set<EventHandler>>();

  on(eventName: string, handler: EventHandler): this {
    const listeners = this.#listeners.get(eventName) ?? new Set<EventHandler>();
    listeners.add(handler);
    this.#listeners.set(eventName, listeners);
    return this;
  }

  off(eventName: string, handler: EventHandler): this {
    this.#listeners.get(eventName)?.delete(handler);
    return this;
  }

  emit(eventName: string, ...args: unknown[]): boolean {
    const listeners = this.#listeners.get(eventName);
    if (!listeners || listeners.size === 0) {
      return false;
    }

    for (const handler of listeners) {
      handler(...args);
    }

    return true;
  }
}
