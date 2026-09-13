// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { createFabLocalPracticeMatch } from "./data/create-local-practice-match";
import {
  clearFabPracticeSession,
  persistFabPracticeSession,
  restoreFabPracticeSession,
  type StoredFabPracticeConfig,
} from "./practice-session";

const CONFIG: StoredFabPracticeConfig = {
  playerDeckId: "cc-guilherme-coutinho-rhinar",
  botDeckId: "cc-guilherme-coutinho-rhinar",
  botStrategyId: "never-defend",
  seed: "practice-session-restore",
};

describe("FAB practice session lifecycle", () => {
  afterEach(() => clearFabPracticeSession());

  it("restores the authoritative active match instead of returning to setup", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    const transition = match.runtime.dispatch("end-turn", "player-1", {});
    expect(transition.accepted).toBe(true);
    const stateId = match.runtime.getStateID();
    const turnNumber = match.runtime.getState().turnNumber;

    expect(persistFabPracticeSession(match, CONFIG)).toBe(true);
    const restored = restoreFabPracticeSession(createFabLocalPracticeMatch);

    expect(restored.kind).toBe("restored");
    if (restored.kind !== "restored") return;
    expect(restored.config).toEqual(CONFIG);
    expect(restored.match.runtime.getStateID()).toBe(stateId);
    expect(restored.match.runtime.getState().turnNumber).toBe(turnNumber);
    expect(restored.match.runtime.hasGameEnded()).toBe(false);
    expect(restored.history).toEqual({ telemetry: [], chatMessages: [] });
  });

  it("restores compact match history across an HMR-style remount", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    const accepted = match.runtime.applyCommand(
      "player-1",
      { move: "end-turn" },
      { commandId: "practice:history:7", timestamp: 1_700_000_000_000 },
    );
    expect(accepted.success).toBe(true);
    if (!accepted.success) return;
    const history = {
      telemetry: [
        {
          id: 7,
          source: "player" as const,
          actorId: "player-1",
          controllerId: "player-1",
          interactionActorId: "player-1",
          commandLabel: "End turn",
          move: "end-turn",
          result: "accepted" as const,
          recordedAt: 1_700_000_000_000,
          turnNumber: accepted.playerLog.turnNumber,
          stateId: accepted.stateID,
          playerLog: accepted.playerLog,
          moveLogs: accepted.moveLogs,
          decisionBefore: null,
          pendingDecision: null,
          completedDecision: null,
          // Runtime callers pass the richer UI entry; persistence must strip
          // these large debug payloads from the session document.
          rawState: "large-state",
          rawInteraction: "large-interaction",
        },
      ],
      chatMessages: [
        {
          id: 3,
          recordedAt: 1_700_000_000_100,
          turn: 2,
          actorId: "player-1",
          message: "Saved locally",
        },
      ],
      analytics: {
        startedAt: 1_700_000_000_000,
        initialTurnPlayerId: "player-1",
        players: [
          {
            playerId: "player-1",
            seat: 1 as const,
            heroName: "Rhinar",
            heroCanonicalId: "hero-rhinar",
            initialLife: 40,
            openingHand: [],
          },
          {
            playerId: "player-2",
            seat: 2 as const,
            heroName: "Rhinar",
            heroCanonicalId: "hero-rhinar",
            initialLife: 40,
            openingHand: [],
          },
        ],
        transitionReceipts: [
          {
            schemaVersion: 2 as const,
            commandId: "practice:1:1",
            stateVersion: 1,
            timestamp: 1_700_000_000_200,
            facts: [],
          },
        ],
      },
    };

    expect(persistFabPracticeSession(match, CONFIG, undefined, history)).toBe(true);
    const serialized = window.sessionStorage.getItem("fab-practice:active-match:v1")!;
    expect(serialized).not.toContain("large-state");
    expect(serialized).not.toContain("large-interaction");

    const restored = restoreFabPracticeSession(createFabLocalPracticeMatch);
    expect(restored.kind).toBe("restored");
    if (restored.kind !== "restored") return;
    expect(restored.history.telemetry).toHaveLength(1);
    expect(restored.history.telemetry[0]).toMatchObject({
      id: 7,
      actorId: "player-1",
      commandLabel: "End turn",
      playerLog: accepted.playerLog,
    });
    expect(restored.history.chatMessages).toEqual(history.chatMessages);
    expect(restored.history.analytics).toEqual(history.analytics);
  });

  it("clears an obsolete snapshot schema instead of retrying it on every visit", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    expect(persistFabPracticeSession(match, CONFIG)).toBe(true);

    const storageKey = "fab-practice:active-match:v1";
    const saved = JSON.parse(window.sessionStorage.getItem(storageKey)!) as {
      snapshot: Record<string, unknown>;
    };
    delete saved.snapshot.automationPreferences;
    window.sessionStorage.setItem(storageKey, JSON.stringify(saved));

    expect(restoreFabPracticeSession(createFabLocalPracticeMatch)).toEqual({ kind: "none" });
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it.each([22, 23])(
    "starts fresh instead of restoring schema-%s practice state",
    (schemaVersion) => {
      const match = createFabLocalPracticeMatch({
        player1DeckId: CONFIG.playerDeckId,
        player2DeckId: CONFIG.botDeckId,
        firstPlayerId: "player-1",
        seed: CONFIG.seed,
      });
      expect(persistFabPracticeSession(match, CONFIG)).toBe(true);

      const storageKey = "fab-practice:active-match:v1";
      const saved = JSON.parse(window.sessionStorage.getItem(storageKey)!) as {
        snapshot: { schemaVersion: number };
      };
      saved.snapshot.schemaVersion = schemaVersion;
      window.sessionStorage.setItem(storageKey, JSON.stringify(saved));

      expect(restoreFabPracticeSession(createFabLocalPracticeMatch)).toEqual({ kind: "none" });
      expect(window.sessionStorage.getItem(storageKey)).toBeNull();
    },
  );

  it("keeps the last valid checkpoint when a transient snapshot cannot be serialized", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    expect(persistFabPracticeSession(match, CONFIG)).toBe(true);
    const savedStateId = match.runtime.getStateID();
    vi.spyOn(match.runtime, "snapshot").mockImplementation(() => {
      throw new Error("Procedure is in flight.");
    });

    expect(persistFabPracticeSession(match, CONFIG)).toBe(false);

    const restored = restoreFabPracticeSession(createFabLocalPracticeMatch);
    expect(restored.kind).toBe("restored");
    if (restored.kind !== "restored") return;
    expect(restored.match.runtime.getStateID()).toBe(savedStateId);
  });

  it("persists the snapshot validated by the accepted command without serializing again", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    const actorId = match.runtime.getPriorityPlayerId();
    expect(actorId).toBeDefined();
    const transition = match.runtime.applyCommand(
      actorId!,
      { move: "pass" },
      {
        commandId: "practice-session:validated-snapshot",
        timestamp: 1,
      },
    );
    expect(transition.success).toBe(true);
    if (!transition.success) return;
    const acceptedStateId = match.runtime.getStateID();
    vi.spyOn(match.runtime, "snapshot").mockImplementation(() => {
      throw new Error("Accepted commands must not be serialized twice.");
    });

    expect(
      persistFabPracticeSession(match, CONFIG, undefined, undefined, transition.snapshot),
    ).toBe(true);

    const restored = restoreFabPracticeSession(createFabLocalPracticeMatch);
    expect(restored.kind).toBe("restored");
    if (restored.kind !== "restored") return;
    expect(restored.match.runtime.getStateID()).toBe(acceptedStateId);
  });

  it("forgets the active checkpoint when a player starts over", () => {
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    expect(persistFabPracticeSession(match, CONFIG)).toBe(true);

    clearFabPracticeSession();

    expect(restoreFabPracticeSession(createFabLocalPracticeMatch)).toEqual({ kind: "none" });
  });

  it("forgets the checkpoint for a named practice fixture when a player starts over", () => {
    const storageKey = "fab-practice:fixture:practice-matchup-rhinar-vs-tuffnut:v1";
    const match = createFabLocalPracticeMatch({
      player1DeckId: CONFIG.playerDeckId,
      player2DeckId: CONFIG.botDeckId,
      firstPlayerId: "player-1",
      seed: CONFIG.seed,
    });
    expect(persistFabPracticeSession(match, CONFIG, storageKey)).toBe(true);

    clearFabPracticeSession(storageKey);

    expect(restoreFabPracticeSession(createFabLocalPracticeMatch, storageKey)).toEqual({
      kind: "none",
    });
  });
});
