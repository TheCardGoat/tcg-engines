# Coach report schema

The coach reads one whole `CoachMatchDump` JSON file (every decision step,
both seats, each step's `move`/`args` **and** `moveLogs`/`gameEvents`).
It does not play the match. It does not pick moves.

```ts
interface CyberpunkCoachReport {
  matchId: string;
  seed: string;
  deckAId?: string;
  deckBId?: string;
  verdict: "sound" | "leaky" | "broken";
  mistakes: {
    stepIndex: number;
    playerId: "p1" | "p2";
    kind:
      | "wrong-gear-host"
      | "sold-engine"
      | "bad-mulligan"
      | "early-go-solo"
      | "skipped-combo"
      | "tempo"
      | "hung"
      | "illegal";
    chosen: string;
    better: string;
    why: string;
    generalRule: string;
    logEvidence: string;
  }[];
  proposedTest: {
    file: string;
    expectMove: string;
    expectArgs?: Record<string, unknown>;
  };
  proposedWeightNudge?: {
    surface: "greedy-weight" | "deck-profile" | "tactical-policy";
    name: string;
    from?: string | number;
    to?: string | number;
    reason: string;
  };
}
```

Read **every** step in order. Do not summarize the match before judging a
line. Cite `moveLogs` / `gameEvents` on the same step as `logEvidence`.

If `better` was not a legal public move, classify `illegal` (engine gap).
If the match `reason` is `stuck`, `illegal`, `repeatedState`, or `maxSteps`,
classify `hung` and fix playability before a heuristic lesson.
