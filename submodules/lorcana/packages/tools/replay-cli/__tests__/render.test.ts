import { describe, it, expect } from "bun:test";
import { renderTurn } from "../src/render";
import type { ExtractedTurn } from "../src/turn-extractor";
import type { ResolvedCard } from "../src/card-resolver";
import type { PersistedReplayData } from "../src/fetch";

function fakeReplay(): PersistedReplayData {
  return {
    version: 2,
    gameId: "test-game",
    matchId: "test-match",
    gameType: "lorcana",
    seed: "s",
    playerIds: ["alice", "bob"],
    cardsMaps: { cardInstances: {}, owners: {} },
    initialState: "{}",
    steps: [],
    metadata: {
      totalMoves: 5,
      totalTurns: 3,
      createdAt: "",
      completedAt: "",
    },
  };
}

function fakeExtracted(): ExtractedTurn {
  return {
    preTurnState: { ctx: { matchID: "test-match" }, lore: { alice: 0, bob: 0 } },
    turnSteps: [
      {
        globalIndex: 12,
        step: {
          patches: [{ op: "replace", path: ["lore", "alice"], value: 2 }],
          logs: [{ event: "questing", instanceId: "inst-A" }],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 2,
            actorId: "alice",
            moveId: "quest",
            input: { instanceId: "inst-A" },
            timestamp: 0,
          },
        },
      },
    ],
    involvedInstanceIds: ["inst-A"],
    cardInstances: { "inst-A": "WeA" },
  };
}

function resolved(): Map<string, ResolvedCard> {
  return new Map([
    [
      "WeA",
      {
        defId: "WeA",
        name: "Ariel",
        fullName: "Ariel - On Human Legs",
        set: "001",
        cardNumber: 1,
        cardType: "character",
        filePath:
          "submodules/lorcana/packages/lorcana/lorcana-cards/src/cards/001/characters/001-ariel-on-human-legs.ts",
      },
    ],
  ]);
}

describe("renderTurn", () => {
  it("emits the three section delimiters in order", () => {
    const out = renderTurn({
      replay: fakeReplay(),
      turn: 2,
      extracted: fakeExtracted(),
      resolvedCards: resolved(),
    });
    const cardsIdx = out.indexOf("--- CARDS INVOLVED ---");
    const stateIdx = out.indexOf("--- INITIAL STATE");
    const stepsIdx = out.indexOf("--- STEPS ---");
    expect(cardsIdx).toBeGreaterThan(0);
    expect(stateIdx).toBeGreaterThan(cardsIdx);
    expect(stepsIdx).toBeGreaterThan(stateIdx);
  });

  it("renders the involved card with its file path and instance ids", () => {
    const out = renderTurn({
      replay: fakeReplay(),
      turn: 2,
      extracted: fakeExtracted(),
      resolvedCards: resolved(),
    });
    expect(out).toContain("WeA");
    expect(out).toContain("Ariel - On Human Legs");
    expect(out).toContain(
      "submodules/lorcana/packages/lorcana/lorcana-cards/src/cards/001/characters/001-ariel-on-human-legs.ts",
    );
    expect(out).toContain("instances: inst-A");
  });

  it("renders the move id, input, logs, and patches for each step", () => {
    const out = renderTurn({
      replay: fakeReplay(),
      turn: 2,
      extracted: fakeExtracted(),
      resolvedCards: resolved(),
    });
    expect(out).toContain("[step 12 · turn 2 · actor alice]");
    expect(out).toContain('move:    quest input={"instanceId":"inst-A"}');
    expect(out).toMatch(/logs:[\s\S]*"event":"questing"/);
    expect(out).toMatch(/patches:[\s\S]*"op":"replace"/);
  });

  it("emits PENDING SELECTIONS block with the raw selectionContext when pendingEffects carry one", () => {
    const extracted = fakeExtracted();
    // Pre-turn state has no pending selection.
    extracted.preTurnState = {
      ctx: { matchID: "test-match" },
      G: { lore: { alice: 0, bob: 0 }, pendingEffects: [] },
    };
    // The step's patches add a pending effect with a selectionContext —
    // simulating a card play that opens a target-selection prompt. After
    // the step resolves, render should emit it under `pendingSelections:`.
    extracted.turnSteps = [
      {
        globalIndex: 12,
        step: {
          patches: [
            {
              op: "add",
              path: ["G", "pendingEffects", 0],
              value: {
                id: "pe-1",
                kind: "target-selection",
                sourceCardId: "WeA",
                chooserId: "alice",
                selectionContext: {
                  origin: "pending-effect",
                  kind: "target-selection",
                  cardCandidateIds: ["inst-B", "inst-C"],
                  playerCandidateIds: [],
                  minSelections: 1,
                  maxSelections: 1,
                },
              },
            },
          ],
          logs: [],
          acceptedMove: {
            stateVersion: 1,
            turnNumber: 2,
            actorId: "alice",
            moveId: "playCard",
            input: { instanceId: "inst-A" },
            timestamp: 0,
          },
        },
      },
    ];

    const out = renderTurn({
      replay: fakeReplay(),
      turn: 2,
      extracted,
      resolvedCards: resolved(),
    });

    expect(out).toContain(`--- PENDING SELECTIONS (before turn 2) ---`);
    expect(out).toContain("(none — no pending player selection at this point)");
    expect(out).toMatch(/pendingSelections:[\s\S]*"kind":"target-selection"/);
    expect(out).toContain('"cardCandidateIds":["inst-B","inst-C"]');
    expect(out).toContain('"chooserId":"alice"');
  });

  it("falls back gracefully when an instance has no resolved card", () => {
    const extracted = fakeExtracted();
    extracted.cardInstances = { "inst-A": "MISSING" }; // no entry in resolved()
    const out = renderTurn({
      replay: fakeReplay(),
      turn: 2,
      extracted,
      resolvedCards: new Map(),
    });
    // No resolved card → the cards section should be the empty-state line.
    expect(out).toContain("(no card instances detected in this turn)");
  });
});
