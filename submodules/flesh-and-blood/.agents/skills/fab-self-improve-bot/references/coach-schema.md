# Coach report schema

The coach reads one whole `FabMatchTranscript` JSON file (every decision
frame, both seats). It does not play the match. It does not edit code.

```ts
interface FabCoachReport {
  matchId: string;
  seed: string;
  verdict: "sound" | "leaky" | "broken";
  mistakes: {
    turnNumber: number;
    frameIndex: number;
    kind:
      | "blocked-combo-card"
      | "missed-combo"
      | "wrong-arsenal"
      | "failed-to-convert"
      | "took-on-hit"
      | "over-blocked"
      | "broke-chain"
      | "tempo"
      | "mirror-ignored"
      | "engine-illegal"
      | "hung"
      | "unpayable-legal";
    chosen: string;
    better: string;
    why: string;
    generalRule: string;
  }[];
  proposedTest: {
    hand: string[];
    arsenal?: string[];
    arena?: string[];
    expectMove: string;
    expectCard?: string;
  }[];
  proposedWeightNudge?: {
    profile: string;
    bonusName: string;
    from: number;
    to: number;
    reason: string;
  }[];
}
```

If `better` was not in `legal`, classify `engine-illegal`. That is an
engine gap, not a heuristic lesson. If the gap is why the bot cannot
play (unpayable `legal` entries, apply rejects the chosen command, no
actor has a real line, the match hits `max-actions` / `stall` /
`illegal` / `engine-throw`), classify `hung` or `unpayable-legal` and
**fix the owning path**. Do not stop and leave the hang in place.
