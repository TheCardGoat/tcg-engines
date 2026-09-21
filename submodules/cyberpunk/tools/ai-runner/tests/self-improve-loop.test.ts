import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vite-plus/test";
import type { CoachDumpStep, CoachMatchDump } from "@tcg/cyberpunk-engine";
import { createCardInstanceId, createPlayerId } from "@tcg/cyberpunk-engine";
import { runSelfImproveBatch } from "../src/self-improve-batch.ts";
import {
  FLOW_GAP_NONE,
  FLOW_GAPS,
  coachWalkDump,
  readJournalJsonl,
  recordKeep,
} from "../src/self-improve-journal.ts";

const P1 = createPlayerId("p1");
const card = createCardInstanceId;

function acted(partial: Partial<CoachDumpStep> & { move: string }): CoachDumpStep {
  return {
    stepIndex: 0,
    playerId: P1,
    kind: "acted",
    moveLogs: [{ type: "keepHand", playerId: P1, turnNumber: 0 }],
    gameEvents: [{ type: "projected" }],
    ...partial,
  };
}

function dump(over: Partial<CoachMatchDump> = {}): CoachMatchDump {
  return {
    version: 1,
    seed: "walk-fixture",
    strategyA: "tactical",
    strategyB: "tactical",
    deckAId: "authored-overwatch-recharge-control",
    deckBId: "authored-overwatch-recharge-control",
    winnerId: "p1",
    reason: "winCondition",
    turnCount: 1,
    stepCount: 1,
    steps: [acted({ move: "keepHand" })],
    ...over,
  };
}

function soldEngineDump(): CoachMatchDump {
  return dump({
    seed: "sold-engine-fixture",
    steps: [
      acted({ move: "keepHand" }),
      acted({
        stepIndex: 17,
        move: "sellCard",
        moveLogs: [
          {
            type: "sellCard",
            cardId: card("sandevistan-1"),
            cardName: "Sandevistan",
            playerId: P1,
            turnNumber: 17,
          },
        ],
        gameEvents: [{ type: "cardSold" }],
      }),
    ],
  });
}

describe("coachWalkDump flow reflection", () => {
  test("names dump-missing-moves when the dump has no acted moves", () => {
    const walk = coachWalkDump(dump({ steps: [] }));
    expect(walk.flowGap).toBe(FLOW_GAPS.dumpMissingMoves);
    expect(walk.flowGap).not.toBe(FLOW_GAP_NONE);
  });

  test("names dump-missing-logs when acted moves have empty logs", () => {
    const walk = coachWalkDump(
      dump({
        steps: [
          {
            stepIndex: 0,
            playerId: "p1",
            kind: "acted",
            move: "keepHand",
            moveLogs: [],
            gameEvents: [],
          },
        ],
      }),
    );
    expect(walk.flowGap).toBe(FLOW_GAPS.dumpMissingLogs);
  });

  test("names named-deck-seating when the dump has no deck id", () => {
    const walk = coachWalkDump(dump({ deckAId: undefined }));
    expect(walk.flowGap).toBe(FLOW_GAPS.namedDeckSeating);
  });

  test("names journal-resume when iteration > 1 has no prior dump", () => {
    const walk = coachWalkDump(dump(), { iteration: 2 });
    expect(walk.flowGap).toBe(FLOW_GAPS.journalResume);
  });

  test("reasoned none on a seated dump with moves, logs, and no heuristic miss", () => {
    const walk = coachWalkDump(dump(), { iteration: 1 });
    expect(walk.mistake).toBe("sound");
    expect(walk.flowGap).toBe(FLOW_GAP_NONE);
    expect(walk.usedFlow).toContain(FLOW_GAPS.namedDeckSeating);
  });

  test("names keep-gate on a heuristic miss and leaves keep unbound", () => {
    const walk = coachWalkDump(soldEngineDump(), { iteration: 1 });
    expect(walk.mistake.startsWith("sold-engine:")).toBe(true);
    expect(walk.keep).toBe("n/a");
    expect(walk.flowGap).toBe(FLOW_GAPS.keepGate);
  });

  test("does not flag selling an extra core copy after one is already in play", () => {
    const walk = coachWalkDump(
      dump({
        deckAId: "authored-relic-smasher-total-sweep",
        steps: [
          acted({
            move: "playCard",
            moveLogs: [
              {
                type: "playCard",
                cardId: card("relic-1"),
                cardName: "The Relic: Experimental Biochip",
                cost: 5,
                playerId: P1,
                turnNumber: 35,
              },
            ],
            gameEvents: [
              {
                type: "cardMoved",
                cardId: "relic-1",
                fromZone: "hand",
                toZone: "field",
                playerId: "p1",
              },
            ],
          }),
          acted({
            stepIndex: 36,
            move: "sellCard",
            moveLogs: [
              {
                type: "sellCard",
                cardName: "The Relic: Experimental Biochip",
                cardId: card("relic-2"),
                playerId: P1,
                turnNumber: 36,
              },
            ],
            gameEvents: [{ type: "cardSold", cardId: "relic-2" }],
          }),
        ],
      }),
    );
    expect(walk.mistake).toBe("sound");
    expect(walk.flowGap).toBe(FLOW_GAP_NONE);
  });

  test("does not flag Go Solo on a Legend that is not a preferred gear host", () => {
    const walk = coachWalkDump(
      dump({
        deckAId: "authored-johnny-fight-ready-steal",
        steps: [
          acted({
            stepIndex: 22,
            move: "goSolo",
            moveLogs: [
              {
                type: "action",
                messageKey: "move.playCard",
                params: { cardName: "Goro Takemura: Hands Unclean" },
                playerId: P1,
                turnNumber: 22,
              },
            ],
            gameEvents: [{ type: "cardPlayed", cardId: "goro" }],
          }),
        ],
      }),
    );
    expect(walk.mistake).toBe("sound");
    expect(walk.flowGap).toBe(FLOW_GAP_NONE);
  });

  test("still flags early Go Solo on a preferred legend host", () => {
    const walk = coachWalkDump(
      dump({
        deckAId: "authored-overwatch-recharge-control",
        steps: [
          acted({
            stepIndex: 22,
            move: "goSolo",
            moveLogs: [
              {
                type: "action",
                messageKey: "move.playCard",
                params: { cardName: "Goro Takemura: Hands Unclean" },
                playerId: P1,
                turnNumber: 22,
              },
            ],
            gameEvents: [{ type: "cardPlayed", cardId: "goro" }],
          }),
        ],
      }),
    );
    expect(walk.mistake).toBe("early-go-solo:step-22");
    expect(walk.flowGap).toBe(FLOW_GAPS.keepGate);
  });
});

describe("runSelfImproveBatch closed loop", () => {
  test("does not play n+1 until keep or reject is recorded on a heuristic miss", () => {
    const dir = mkdtempSync(join(tmpdir(), "self-improve-loop-"));
    const dumpDir = join(dir, "dumps");
    const journalJsonl = join(dir, "journal.jsonl");
    const journalMarkdown = join(dir, "iterations.md");
    const deckId = "authored-overwatch-recharge-control";
    let plays = 0;

    const first = runSelfImproveBatch({
      iterations: 2,
      seedBase: "loop-test",
      dumpDir,
      journalJsonl,
      journalMarkdown,
      deckIds: [deckId],
      playMatch: () => {
        plays += 1;
        return soldEngineDump();
      },
    });

    expect(plays).toBe(1);
    expect(first).toHaveLength(1);
    expect(first[0]?.flowGap).toBe(FLOW_GAPS.keepGate);
    expect(first[0]?.keep).toBe("n/a");
    expect(first[0]?.dumpPath).toBe(join(dumpDir, deckId, "iter-1.json"));

    const blocked = runSelfImproveBatch({
      iterations: 2,
      seedBase: "loop-test",
      dumpDir,
      journalJsonl,
      journalMarkdown,
      deckIds: [deckId],
      playMatch: () => {
        plays += 1;
        return dump({ seed: "should-not-play" });
      },
    });
    expect(plays).toBe(1);
    expect(blocked).toHaveLength(1);

    const recorded = recordKeep({
      journalJsonl,
      journalMarkdown,
      deckId,
      keep: "reject",
    });
    expect(recorded.keep).toBe("reject");
    expect(recorded.usedFlow).toContain(FLOW_GAPS.keepGate);
    expect(readJournalJsonl(journalJsonl)[0]?.keep).toBe("reject");

    const resumed = runSelfImproveBatch({
      iterations: 2,
      seedBase: "loop-test",
      dumpDir,
      journalJsonl,
      journalMarkdown,
      deckIds: [deckId],
      playMatch: () => {
        plays += 1;
        return dump({ seed: "iter-2" });
      },
    });

    expect(plays).toBe(2);
    expect(resumed).toHaveLength(2);
    expect(resumed[1]?.iteration).toBe(2);
    expect(resumed[1]?.priorDumpPath).toBe(first[0]?.dumpPath);
    expect(resumed[1]?.usedFlow).toContain(FLOW_GAPS.journalResume);
    expect(resumed[1]?.usedFlow).toContain(FLOW_GAPS.keepGate);
    expect(resumed[1]?.flowGap).toBe(FLOW_GAP_NONE);
  });
});
