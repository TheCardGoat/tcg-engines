import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  clearPracticeSession,
  loadPracticeSession,
  savePracticeSession,
} from "./practice-match-storage.js";
import type { PracticeMatchSession } from "./types.js";

const STORAGE_KEY = "lorcana.simulator.practiceMatch.session";

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

const originalLocalStorage = globalThis.localStorage;

describe("practice-match-storage", () => {
  beforeEach(() => {
    globalThis.localStorage = new MemoryStorage();
  });
  afterEach(() => {
    if (originalLocalStorage) {
      globalThis.localStorage = originalLocalStorage;
    } else {
      Reflect.deleteProperty(globalThis, "localStorage");
    }
  });

  it("loadPracticeSession maps legacy playerId to gameProfileId", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        matchId: "m1",
        gameId: "g1",
        playerId: "gp_legacy",
        botPlayerId: "",
        deckConfig: {},
      }),
    );
    const s = loadPracticeSession("g1");
    expect(s).not.toBeNull();
    expect(s!.gameProfileId).toBe("gp_legacy");
    expect(s!.matchId).toBe("m1");
  });

  it("prefers gameProfileId over legacy playerId", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        matchId: "m1",
        gameId: "g1",
        gameProfileId: "gp_new",
        playerId: "gp_old",
        botPlayerId: "",
        deckConfig: {},
      }),
    );
    const s = loadPracticeSession("g1");
    expect(s!.gameProfileId).toBe("gp_new");
  });

  it("loads userId when present", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        matchId: "m1",
        gameId: "g1",
        gameProfileId: "gp1",
        userId: "usr_1",
        botPlayerId: "",
        deckConfig: {},
      }),
    );
    const s = loadPracticeSession("g1");
    expect(s?.userId).toBe("usr_1");
  });

  it("savePracticeSession round-trips gameProfileId and userId", () => {
    const session: PracticeMatchSession = {
      matchId: "m1",
      gameId: "g1",
      gameProfileId: "gp1",
      userId: "u1",
      botPlayerId: "",
      deckConfig: {} as PracticeMatchSession["deckConfig"],
    };
    savePracticeSession(session);
    const loaded = loadPracticeSession("g1");
    expect(loaded?.gameProfileId).toBe("gp1");
    expect(loaded?.userId).toBe("u1");
  });

  it("clearPracticeSession removes stored session", () => {
    savePracticeSession({
      matchId: "m1",
      gameId: "g1",
      gameProfileId: "gp1",
      botPlayerId: "",
      deckConfig: {} as PracticeMatchSession["deckConfig"],
    });
    clearPracticeSession();
    expect(loadPracticeSession("g1")).toBeNull();
  });
});
