import { describe, expect, it } from "bun:test";

import {
  IMMERSIVE_ROUTE_ATTRIBUTE,
  IMMERSIVE_ROUTE_VALUE,
  IMMERSIVE_SESSION_STORAGE_KEY,
  persistImmersiveSessionStarted,
  readImmersiveSessionStarted,
  setImmersiveDocumentChrome,
} from "./immersive-session.js";

class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  clear(): void {
    this.#entries.clear();
  }

  getItem(key: string): string | null {
    return this.#entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, value);
  }
}

describe("immersive session helpers", () => {
  it("persists the session start flag", () => {
    const storage = new MemoryStorage();

    persistImmersiveSessionStarted(storage);

    expect(storage.getItem(IMMERSIVE_SESSION_STORAGE_KEY)).toBe("true");
    expect(readImmersiveSessionStarted(storage)).toBe(true);
  });

  it("applies immersive chrome attributes to html and body", () => {
    const html = new Map<string, string>();
    const body = new Map<string, string>();
    const document = {
      documentElement: {
        setAttribute: (name: string, value: string) => html.set(name, value),
        removeAttribute: (name: string) => html.delete(name),
      },
      body: {
        setAttribute: (name: string, value: string) => body.set(name, value),
        removeAttribute: (name: string) => body.delete(name),
      },
    } as unknown as Document;

    setImmersiveDocumentChrome(true, document);
    expect(html.get(IMMERSIVE_ROUTE_ATTRIBUTE)).toBe(IMMERSIVE_ROUTE_VALUE);
    expect(body.get(IMMERSIVE_ROUTE_ATTRIBUTE)).toBe(IMMERSIVE_ROUTE_VALUE);

    setImmersiveDocumentChrome(false, document);
    expect(html.has(IMMERSIVE_ROUTE_ATTRIBUTE)).toBe(false);
    expect(body.has(IMMERSIVE_ROUTE_ATTRIBUTE)).toBe(false);
  });
});
