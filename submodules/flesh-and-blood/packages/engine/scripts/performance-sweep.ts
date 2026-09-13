/** Deterministic self-play with production runtime ownership and repeated host projections. */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { createFabPracticeMatch } from "../src/automation/create-practice-match.ts";
import { listFabDecks } from "../src/automation/deck-catalog.ts";
import { chooseAutomatedAction, submitAutomatedAction } from "../src/automation/bot-strategies.ts";
import { getSafeFabAutomatedActionStrategyOption } from "../src/automation/strategy-registry.ts";
import { listLegalCommands } from "../src/automation/legal-commands.ts";
import { FabMatchRuntime } from "../src/runtime.ts";
import { observeFabPerformance } from "../src/performance-observer.ts";
import { nextRandom, seedFromString } from "../src/random.ts";
import type { FabViewer } from "../src/view.ts";

const out = resolve(process.argv[2] ?? "reports/performance.json");
const seeds = Number(process.env.FAB_PERF_SEEDS ?? 2);
const maxActions = Number(process.env.FAB_PERF_ACTIONS ?? 400);
const deckIds = process.env.FAB_PERF_DECKS?.split(",") ?? listFabDecks().map((deck) => deck.id);
for (const [name, value] of [
  ["FAB_PERF_SEEDS", seeds],
  ["FAB_PERF_ACTIONS", maxActions],
] as const) {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error(`${name} must be a positive integer`);
}
if (deckIds.some((id) => !listFabDecks().some((deck) => deck.id === id))) {
  throw new Error("FAB_PERF_DECKS must contain catalog deck ids");
}
const strategy = getSafeFabAutomatedActionStrategyOption("value-extract").strategy;
const samples = new Map<string, number[]>();
const operations = new Map<string, { count: number; totalMs: number }>();
/** Record key order is not gameplay; retain exact ordering of every array. */
function trajectoryJson(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return Object.fromEntries(
        Object.entries(item).sort(([left], [right]) => left.localeCompare(right)),
      );
    }
    return item;
  });
}
function timed<T>(name: string, run: () => T): T {
  const start = performance.now();
  try {
    return run();
  } finally {
    const values = samples.get(name) ?? [];
    values.push(performance.now() - start);
    samples.set(name, values);
  }
}
function summary(values: readonly number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const quantile = (q: number) => sorted[Math.max(0, Math.ceil(sorted.length * q) - 1)] ?? 0;
  return {
    count: values.length,
    totalMs: values.reduce((a, b) => a + b, 0),
    medianMs: quantile(0.5),
    p95Ms: quantile(0.95),
    maxMs: quantile(1),
  };
}
const matches = [];
for (const [deckIndex, p1Deck] of deckIds.entries()) {
  const p2Deck = deckIds[(deckIndex + 1) % deckIds.length]!;
  for (let seedIndex = 0; seedIndex < seeds; seedIndex++) {
    const seed = `performance-${deckIndex}-${seedIndex}`;
    const hash = createHash("sha256");
    let actions = 0;
    let termination = "max-actions";
    let error: string | undefined;
    let rng = seedFromString(seed);
    const start = performance.now();
    try {
      const practice = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
        seed,
        player1DeckId: p1Deck,
        player2DeckId: p2Deck,
      });
      const runtime = new FabMatchRuntime(practice.runtime.cloneState());
      const viewers: FabViewer[] = runtime
        .playerIds()
        .map((actorId) => ({ role: "player", actorId }));
      viewers.push({ role: "spectator" });
      observeFabPerformance((sample) => {
        const aggregate = operations.get(sample.operation) ?? { count: 0, totalMs: 0 };
        aggregate.count++;
        aggregate.totalMs += sample.durationMs;
        operations.set(sample.operation, aggregate);
      });
      while (actions < maxActions && !runtime.hasGameEnded()) {
        const state = runtime.getState();
        const actors = [
          ...new Set([
            state.decision?.actorId,
            runtime.getPriorityPlayerId(),
            runtime.getActivePlayerId(),
            ...runtime.playerIds(),
          ]),
        ].filter((id): id is string => Boolean(id));
        const next = timed("legal", () => {
          for (const actorId of actors) {
            const legal = listLegalCommands(runtime, actorId);
            if (legal.length) return { actorId, legal };
          }
          return null;
        });
        if (!next) {
          termination = "stall";
          break;
        }
        // Response and persistence request the same committed viewer data.
        for (let repeat = 0; repeat < 2; repeat++) {
          for (const viewer of viewers) {
            const projection = timed(
              `viewer:${state.decision?.kind === "payment" ? "payment" : "settled"}:${repeat}`,
              () => runtime.viewer(viewer),
            );
            const resources = timed(`resources:${repeat}`, () => runtime.viewerResources(viewer));
            hash.update(trajectoryJson([projection, resources]));
          }
        }
        const roll = nextRandom(rng);
        rng = roll.state;
        const command =
          timed("bot", () =>
            chooseAutomatedAction(runtime, next.actorId, strategy, { random: () => roll.value }),
          ) ?? next.legal[0]!;
        hash.update(trajectoryJson([next.actorId, next.legal, command]));
        const result = timed(`command:${command.move}`, () =>
          timed(
            `command-context:${command.move}:${state.decision?.kind ?? state.phase}:${state.combat?.step ?? "no-combat"}`,
            () => submitAutomatedAction(runtime, next.actorId, command, next.legal),
          ),
        );
        actions++;
        if (!result.advanced) {
          termination = "illegal";
          error = result.error;
          break;
        }
        const snapshot = timed("snapshot", () => runtime.snapshot());
        // Persistence timestamps order continuous effects and must be retained.
        hash.update(trajectoryJson(snapshot));
      }
      if (runtime.hasGameEnded()) termination = runtime.getGameEndResult()?.reason ?? "ended";
    } catch (caught) {
      termination = "error";
      error = caught instanceof Error ? caught.message : String(caught);
    } finally {
      observeFabPerformance(null);
    }
    const match = {
      seed,
      p1Deck,
      p2Deck,
      actions,
      termination,
      error,
      digest: hash.digest("hex"),
      durationMs: performance.now() - start,
    };
    matches.push(match);
    console.log(JSON.stringify(match));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(
      out,
      JSON.stringify(
        {
          version: 1,
          trajectoryVersion: 2,
          environment: {
            node: process.version,
            platform: process.platform,
            arch: process.arch,
            nodeEnv: process.env.NODE_ENV ?? null,
          },
          seeds,
          maxActions,
          deckIds,
          strategy: "value-extract",
          projectionRepeats: 2,
          matches,
          samples: Object.fromEntries(
            [...samples].map(([name, values]) => [name, summary(values)]),
          ),
          operations: Object.fromEntries(operations),
        },
        null,
        2,
      ) + "\n",
    );
  }
}
if (matches.some((match) => ["error", "illegal", "stall"].includes(match.termination)))
  process.exitCode = 1;
