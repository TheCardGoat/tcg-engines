import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import {
  AUTOMATED_ACTION_STRATEGIES,
  CYBERPUNK_AUTOMATION_REVISION,
  runAutoMatch,
  type AIStrategy,
} from "@tcg/cyberpunk-engine";
import { stableBotHash, type BotCandidateManifestV1 } from "@tcg/bot-core";
import {
  createAuthoredBotLabDecks,
  createStructuredCatalog,
  deckListFromGenerated,
} from "../../../../cyberpunk/tools/ai-runner/src/legal-decks.ts";
import { createTestPlayers } from "../../../../cyberpunk/tools/ai-runner/src/test-catalog.ts";
import { bindStrategyToDeck } from "../../../../cyberpunk/tools/ai-runner/src/bind-deck-strategy.ts";
import { lookupStrategy } from "../../../../cyberpunk/tools/ai-runner/src/runner.ts";
import {
  createChoombattlerReferenceAdapter,
  REFERENCE_ADAPTER_VERSION,
} from "./adapters/cyberpunk-reference/adapter.ts";

const experimental = ["monte-carlo", "monte-carlo-greedy", "mcts", "mcts-greedy"];
const controls = new Set([
  "first-legal",
  "random",
  "attack-rival-only",
  "attack-unit-only",
  "call-legend-only",
  "pass-only",
]);
export const gauntletStrategies = [
  ...AUTOMATED_ACTION_STRATEGIES.filter((option) => option.id !== "default").map((option) => ({
    id: option.id,
    label: option.label,
    informationPolicy: option.informationPolicy,
    control: controls.has(option.id),
    settings: "registered defaults",
  })),
  ...experimental.map((id) => ({
    id,
    label: id,
    informationPolicy: "public" as const,
    control: false,
    settings: id.startsWith("monte-carlo")
      ? "AI runner defaults: 1 rollout/action, 10 rollout steps"
      : "shipped defaults: 50 iterations, 200 rollout steps",
  })),
];

export interface GauntletGame {
  index: number;
  block: string;
  seed: string;
  swap: boolean;
  deckA: string;
  deckB: string;
  strategyA: string;
  strategyB: string;
}
export interface GauntletRow extends GauntletGame {
  winner: "a" | "b" | null;
  reason: string;
  valid: boolean;
  failedStrategy: string | null;
  actions: number;
  turns: number;
  finalHash: string;
  traceHash: string;
  elapsedMs: number;
  error?: string;
}
interface GauntletPlan {
  schemaVersion: 1;
  phase: "deck-selection" | "strategy-screen" | "finalists" | "choombattler-reference";
  engine: "tcg-online" | "choombattler";
  provenance: string;
  seedBase: string;
  seedsPerPair: number;
  strategies: string[];
  decks: string[];
  games: GauntletGame[];
  workerPath?: string;
  catalogPath?: string;
}
export function mirrorSchedule(
  decks: readonly string[],
  strategies: readonly string[],
  seeds: number,
  seedBase: string,
): GauntletGame[] {
  const games: GauntletGame[] = [];
  for (const deck of decks)
    for (let a = 0; a < strategies.length; a++) {
      for (let b = a + 1; b < strategies.length; b++)
        for (let seed = 0; seed < seeds; seed++) {
          // Strategy-independent shuffle streams, reused for each opponent and seat.
          const commonSeed = `${seedBase}/${deck}/seed-${seed}`;
          const block = `${deck}/${strategies[a]}-vs-${strategies[b]}/seed-${seed}`;
          for (const swap of [false, true])
            games.push({
              index: games.length,
              block,
              seed: commonSeed,
              swap,
              deckA: deck,
              deckB: deck,
              strategyA: strategies[a]!,
              strategyB: strategies[b]!,
            });
        }
    }
  return games;
}
export function standings(
  rows: readonly GauntletRow[],
  ids: readonly string[],
  kind: "strategy" | "deck",
  competitiveOnly = false,
) {
  return ids
    .map((id) => {
      const matches = rows.filter((row) => {
        const a = kind === "deck" ? row.deckA : row.strategyA;
        const b = kind === "deck" ? row.deckB : row.strategyB;
        if (a !== id && b !== id) return false;
        const opponent = a === id ? row.strategyB : row.strategyA;
        return !competitiveOnly || !controls.has(opponent);
      });
      const valid = matches.filter((row) => row.valid);
      let wins = 0,
        losses = 0,
        draws = 0;
      for (const row of valid) {
        const isA = (kind === "deck" ? row.deckA : row.strategyA) === id;
        if (row.winner === null) draws++;
        else if ((row.winner === "a") === isA) wins++;
        else losses++;
      }
      return {
        id,
        games: matches.length,
        validGames: valid.length,
        wins,
        losses,
        draws,
        failures: matches.filter((row) => !row.valid).length,
        ownFailures: matches.filter((row) => row.failedStrategy === id).length,
        score: valid.length ? (wins + 0.5 * draws) / valid.length : 0,
        eligible: valid.length > 0 && matches.every((row) => row.failedStrategy !== id),
      };
    })
    .sort(
      (a, b) =>
        Number(b.eligible) - Number(a.eligible) || b.score - a.score || a.id.localeCompare(b.id),
    );
}

const deckPool = createAuthoredBotLabDecks();
const byDeck = new Map(deckPool.map((deck) => [deck.id, deck]));
const catalog = createStructuredCatalog();
/** Explicit decks skip the ranking phase while retaining mirror fairness. */
export function selectGauntletDecks(ids?: readonly string[]): string[] | undefined {
  if (ids === undefined) return undefined;
  if (ids.length === 0) throw new Error("Select at least one authored deck");
  if (new Set(ids).size !== ids.length) throw new Error("Gauntlet deck ids must be unique");
  for (const id of ids) if (!byDeck.has(id)) throw new Error(`Unknown authored deck: ${id}`);
  return [...ids];
}
function strategy(id: string): AIStrategy {
  const registered = AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === id);
  return registered?.strategy ?? lookupStrategy(id);
}
function sourceHash() {
  const hash = createHash("sha256");
  for (const root of [
    "../../../../cyberpunk/packages/engine/src/",
    "../../../../cyberpunk/packages/utils/src/",
    "../../../../cyberpunk/tools/ai-runner/src/",
  ]) {
    const path = fileURLToPath(new URL(root, import.meta.url));
    const files = readdirSync(path, { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
      .sort();
    for (const file of files) hash.update(root + file).update(readFileSync(join(path, file)));
  }
  hash.update(readFileSync(fileURLToPath(import.meta.url)));
  return hash.digest("hex");
}
function nativeProvenance() {
  return stableBotHash({
    revision: CYBERPUNK_AUTOMATION_REVISION,
    source: sourceHash(),
    cards: [...catalog.entries()],
    decks: deckPool,
    strategies: gauntletStrategies,
  });
}
function write(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
function runNative(game: GauntletGame): GauntletRow {
  const a = byDeck.get(game.deckA),
    b = byDeck.get(game.deckB);
  if (!a || !b) throw new Error("Unknown deck in gauntlet plan");
  const deck1 = game.swap ? b : a,
    deck2 = game.swap ? a : b;
  const result = runAutoMatch({
    players: createTestPlayers(),
    catalog,
    seed: game.seed,
    decks: [deckListFromGenerated(deck1, "p1"), deckListFromGenerated(deck2, "p2")],
    strategies: [
      bindStrategyToDeck(strategy(game.swap ? game.strategyB : game.strategyA), deck1),
      bindStrategyToDeck(strategy(game.swap ? game.strategyA : game.strategyB), deck2),
    ],
  });
  const valid =
    !result.automationConcessionApplied &&
    ["winCondition", "deckOut", "concede"].includes(result.reason) &&
    !result.log.some((entry) => entry.result.kind === "illegal" || entry.result.kind === "stuck");
  const failedSeat = valid ? null : result.log.at(-1)?.playerId;
  const aSeat = game.swap ? "p2" : "p1";
  return {
    ...game,
    winner: valid && result.winnerId ? (result.winnerId === aSeat ? "a" : "b") : null,
    reason: result.reason,
    valid,
    failedStrategy: failedSeat ? (failedSeat === aSeat ? game.strategyA : game.strategyB) : null,
    actions: result.stepCount,
    turns: result.turnCount,
    finalHash: result.finalStateHash,
    traceHash: stableBotHash(
      result.log.map((entry) => ({
        step: entry.stepIndex,
        player: entry.playerId,
        kind: entry.result.kind,
        decision:
          entry.result.kind === "acted" || entry.result.kind === "illegal"
            ? entry.result.decision
            : null,
      })),
    ),
    elapsedMs: 0,
  };
}
function referenceManifest(
  plan: GauntletPlan,
  revision: string,
  cardHash: string,
): BotCandidateManifestV1 {
  return {
    schemaVersion: 1,
    game: "cyberpunk",
    candidateId: "expert-oracle",
    parentStrategyId: "choombattler-expert",
    informationPolicy: "oracle",
    hypothesis: "Exact reference diagnostic on the selected top three local decks",
    engineRevision: revision,
    cardCatalogHash: cardHash,
    adapterVersion: REFERENCE_ADAPTER_VERSION,
    changes: {},
    evaluation: {
      suiteId: "reference-authored",
      seedBase: plan.seedBase,
      minimumBlocks: 1,
      maximumBlocks: 1,
      batchSize: 1,
      confidenceLevel: 0.95,
      minimumMeanImprovement: 0,
      maximumCellRegression: 1,
    },
  };
}
async function runWorker(directory: string, shard: number, count: number) {
  const plan: GauntletPlan = JSON.parse(readFileSync(join(directory, "plan.json"), "utf8"));
  const reference =
    plan.engine === "choombattler"
      ? createChoombattlerReferenceAdapter(plan.workerPath!, plan.catalogPath!)
      : null;
  const nativeHash = nativeProvenance();
  const provenance = reference
    ? stableBotHash({
        native: nativeHash,
        engine: reference.getEngineRevision(),
        cards: reference.getCardCatalogHash(),
      })
    : nativeHash;
  if (provenance !== plan.provenance)
    throw new Error("Gauntlet source/catalog drift; use a fresh run directory");
  for (let index = shard; index < plan.games.length; index += count) {
    const game = plan.games[index]!;
    const path = join(directory, `${index}.json`);
    if (existsSync(path)) continue;
    const start = performance.now();
    let row: GauntletRow;
    try {
      if (reference) {
        const result = await reference.runMatch({
          candidateManifest: referenceManifest(
            plan,
            reference.getEngineRevision(),
            reference.getCardCatalogHash(),
          ),
          baselineStrategyId: "choombattler-expert",
          scheduledMatch: {
            blockId: game.block,
            pairId: game.deckA,
            legId: game.swap ? "seat-2" : "seat-1",
            seed: game.seed,
            p1DeckId: game.deckA,
            p2DeckId: game.deckB,
            p1Controller: game.swap ? "baseline" : "candidate",
            p2Controller: game.swap ? "candidate" : "baseline",
          },
        });
        const valid = ["rules-win", "deck-out", "player-concession"].includes(result.termination);
        row = {
          ...game,
          winner: valid && result.winner ? (result.winner === "candidate" ? "a" : "b") : null,
          reason: result.termination,
          valid,
          failedStrategy: null,
          actions: result.actionCount,
          turns: result.turnCount,
          finalHash: result.finalStateHash,
          traceHash: stableBotHash(result),
          elapsedMs: 0,
        };
      } else row = runNative(game);
    } catch (error) {
      row = {
        ...game,
        winner: null,
        reason: "infrastructure-error",
        valid: false,
        failedStrategy: null,
        actions: 0,
        turns: 0,
        finalHash: "",
        traceHash: "",
        elapsedMs: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
    row.elapsedMs = performance.now() - start;
    write(path, row);
    console.log(
      `${plan.phase} ${index + 1}/${plan.games.length} ${row.reason} ${Math.round(row.elapsedMs)}ms`,
    );
  }
  if (nativeProvenance() !== nativeHash)
    throw new Error("Gauntlet source drift during worker execution");
}
async function execute(directory: string, plan: GauntletPlan, workers: number) {
  mkdirSync(directory, { recursive: true });
  const path = join(directory, "plan.json");
  if (
    existsSync(path) &&
    stableBotHash(JSON.parse(readFileSync(path, "utf8"))) !== stableBotHash(plan)
  )
    throw new Error("Saved gauntlet plan differs; choose a fresh directory");
  write(path, plan);
  const processes = Array.from({ length: Math.min(workers, plan.games.length) }, (_, shard) => {
    const child = spawn(
      process.execPath,
      [
        fileURLToPath(import.meta.url),
        "--gauntlet-worker",
        directory,
        String(shard),
        String(workers),
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    child.stdout?.on("data", (data: Buffer) => process.stdout.write(data));
    child.stderr?.on("data", (data: Buffer) => process.stderr.write(data));
    return new Promise<number | null>((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", resolve);
    });
  });
  const codes = await Promise.all(processes);
  if (codes.some((code) => code !== 0))
    throw new Error(`Gauntlet workers failed: ${codes.join(",")}`);
  const rows: GauntletRow[] = plan.games.map((_, index) =>
    JSON.parse(readFileSync(join(directory, `${index}.json`), "utf8")),
  );
  const kind = plan.phase === "deck-selection" ? "deck" : "strategy";
  const ids = kind === "deck" ? plan.decks : plan.strategies;
  const report = {
    ...plan,
    scheduleHash: stableBotHash(plan.games),
    strategyDescriptors: gauntletStrategies,
    aliases: { default: "expert-oracle" },
    promotionEligible: false,
    totalGames: rows.length,
    invalidGames: rows.filter((row) => !row.valid).length,
    standings: standings(rows, ids, kind),
    competitiveStandings: standings(
      rows,
      ids.filter((id) => !controls.has(id)),
      kind,
      kind === "strategy",
    ),
    rows,
  };
  write(join(directory, "report.json"), report);
  return report;
}

export async function runCyberpunkGauntlet(options: {
  directory: string;
  workers: number;
  workerPath: string;
  catalogPath: string;
  deckIds?: readonly string[];
  seedBase?: string;
}) {
  if (!Number.isInteger(options.workers) || options.workers < 1 || options.workers > 18)
    throw new Error("Workers must be an integer from 1 to 18");
  let topDecks = selectGauntletDecks(options.deckIds);
  const seedBase = options.seedBase ?? "cyberpunk-gauntlet-2026-10-07-v1";
  if (!seedBase.trim()) throw new Error("Seed base must not be empty");
  const provenance = nativeProvenance();
  let selection: Awaited<ReturnType<typeof execute>> | null = null;
  if (!topDecks) {
    const decks = deckPool.map((deck) => deck.id);
    const selectionGames: GauntletGame[] = [];
    for (let a = 0; a < decks.length; a++)
      for (let b = a + 1; b < decks.length; b++) {
        for (let seed = 0; seed < 2; seed++)
          for (const swap of [false, true]) {
            selectionGames.push({
              index: selectionGames.length,
              block: `${decks[a]}-vs-${decks[b]}/seed-${seed}`,
              seed: `${seedBase}/deck-selection/${decks[a]}-vs-${decks[b]}/seed-${seed}`,
              swap,
              deckA: decks[a]!,
              deckB: decks[b]!,
              strategyA: "tactical",
              strategyB: "tactical",
            });
          }
      }
    selection = await execute(
      join(options.directory, "deck-selection"),
      {
        schemaVersion: 1,
        phase: "deck-selection",
        engine: "tcg-online",
        provenance,
        seedBase,
        seedsPerPair: 2,
        strategies: ["tactical"],
        decks,
        games: selectionGames,
      },
      options.workers,
    );
    if (selection.invalidGames)
      throw new Error("Deck selection has invalid games; cannot claim a top three");
    topDecks = selection.standings.slice(0, 3).map((row) => row.id);
  }
  console.log(`Selected decks: ${topDecks.join(", ")}`);
  const ids = gauntletStrategies.map((strategy) => strategy.id);
  const screen = await execute(
    join(options.directory, "strategy-screen"),
    {
      schemaVersion: 1,
      phase: "strategy-screen",
      engine: "tcg-online",
      provenance,
      seedBase,
      seedsPerPair: 2,
      strategies: ids,
      decks: topDecks,
      games: mirrorSchedule(topDecks, ids, 2, `${seedBase}/screen`),
    },
    options.workers,
  );
  const finalists = screen.competitiveStandings
    .filter((row) => row.eligible)
    .slice(0, 3)
    .map((row) => row.id);
  if (finalists.length < 3)
    throw new Error("Fewer than three strategies completed valid games without their own failures");
  const final = await execute(
    join(options.directory, "finalists"),
    {
      schemaVersion: 1,
      phase: "finalists",
      engine: "tcg-online",
      provenance,
      seedBase,
      seedsPerPair: 5,
      strategies: finalists,
      decks: topDecks,
      games: mirrorSchedule(topDecks, finalists, 5, `${seedBase}/holdout`),
    },
    options.workers,
  );
  const reference = createChoombattlerReferenceAdapter(options.workerPath, options.catalogPath);
  const referenceReport = await execute(
    join(options.directory, "choombattler-reference"),
    {
      schemaVersion: 1,
      phase: "choombattler-reference",
      engine: "choombattler",
      provenance: stableBotHash({
        native: provenance,
        engine: reference.getEngineRevision(),
        cards: reference.getCardCatalogHash(),
      }),
      seedBase,
      seedsPerPair: 2,
      strategies: ["expert-oracle", "choombattler-expert"],
      decks: topDecks,
      games: mirrorSchedule(
        topDecks,
        ["expert-oracle", "choombattler-expert"],
        2,
        `${seedBase}/reference`,
      ),
      workerPath: options.workerPath,
      catalogPath: options.catalogPath,
    },
    Math.min(options.workers, 6),
  );
  if (nativeProvenance() !== provenance) throw new Error("Sources changed during the gauntlet");
  write(join(options.directory, "report.json"), {
    schemaVersion: 1,
    seedBase,
    provenance,
    decks: topDecks,
    deckSelection: selection ? "ranked" : "explicit",
    selection: selection?.standings ?? null,
    screen: screen.competitiveStandings,
    finalists: final.standings,
    reference: referenceReport.standings,
    invalidGames: screen.invalidGames + final.invalidGames + referenceReport.invalidGames,
    totalGames:
      (selection?.totalGames ?? 0) +
      screen.totalGames +
      final.totalGames +
      referenceReport.totalGames,
    promotionEligible: false,
    boundaries: [
      selection
        ? "Top decks are local Sharp-vs-Sharp benchmark winners, not a tournament meta ranking."
        : "Decks were explicitly selected; this run does not rank decks.",
      "Strategies retain their declared public/oracle information policies; this is not an equal-information promotion gate.",
      "Default is an Expert alias. Controls are included in the screen but excluded from finalist selection.",
      "Choombattler runs on its native engine with our adapted Expert chooser; scores cannot be merged with native-engine standings.",
    ],
  });
  console.log(`Gauntlet complete: ${join(options.directory, "report.json")}`);
}

if (process.argv[2] === "--gauntlet-worker") {
  await runWorker(process.argv[3]!, Number(process.argv[4]), Number(process.argv[5]));
}
