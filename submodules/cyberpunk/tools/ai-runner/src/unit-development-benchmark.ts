/** Diagnostic A/B experiment. Never changes or promotes the default bot.
 * Run: bun tools/ai-runner/src/unit-development-benchmark.ts <fresh-output> run
 * Holdout: append --holdout. Replay: <output> replay <index> 6 [--holdout].
 * Both seats use the same seed and decks. Every result stores full coach logs.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createExpertOracleStrategy } from "../../../packages/engine/src/automation/search/expert-oracle.ts";
import {
  tacticalStrategy,
  runAutoMatch,
  buildCoachDump,
  CYBERPUNK_AUTOMATION_REVISION,
} from "../../../packages/engine/src/automation/index.ts";
import {
  createLegalDeckPool,
  createStructuredCatalog,
  deckListFromGenerated,
} from "./legal-decks.ts";
import { createTestPlayers } from "./test-catalog.ts";
import { bindStrategyToDeck } from "./bind-deck-strategy.ts";
import {
  pairedBootstrapConfidenceInterval,
  stableBotHash,
} from "../../../../agnostic-simulator/packages/bot-core/src/index.ts";
const settings = { beamWidth: 5, depthLimit: 12, replyLines: 4, maxNodes: 768 };
const originalExpert = () => createExpertOracleStrategy({ ...settings, unitDevelopmentWeight: 0 });
const candidateExpert = () =>
  createExpertOracleStrategy({ ...settings, unitDevelopmentWeight: 40 });
interface MatchRow {
  index: number;
  deckA: string;
  deckB: string;
  seed: string;
  opponent: string;
  swap: boolean;
  winner: string | null;
  candidateWon: boolean;
  reason: string;
  failed: boolean;
  steps: number;
  turns: number;
  finalHash: string;
  elapsedMs: number;
}
const output = process.argv[2];
if (!output) throw new Error("Provide a fresh results directory.");
const mode = process.argv[3] ?? "run";
const holdout = process.argv.includes("--holdout");
const shard = Number(process.argv[4] ?? 0),
  workers = Number(process.argv[5] ?? 6);
const pool = createLegalDeckPool("authored-botlab"),
  catalog = createStructuredCatalog();
const chooserHash = createHash("sha256");
for (const file of ["search/expert-oracle.ts", "search/evaluate-board.ts", "search/tactical.ts"])
  chooserHash.update(
    readFileSync(new URL(`../../../packages/engine/src/automation/${file}`, import.meta.url)),
  );
const provenance = {
  automationRevision: CYBERPUNK_AUTOMATION_REVISION,
  chooserHash: chooserHash.digest("hex"),
  cardCatalogHash: stableBotHash([...catalog.entries()]),
  deckPoolHash: stableBotHash(pool.decks),
  candidateOptions: { ...settings, unitDevelopmentWeight: 40 },
  baselineOptions: { ...settings, unitDevelopmentWeight: 0 },
};
const groups = holdout ? ["expert"] : ["expert", "sharp-before", "sharp-after"];
const plan = pool.decks.flatMap((a) =>
  Array.from({ length: holdout ? 2 : 1 }, (_, block) =>
    groups.flatMap((opponent) =>
      [false, true].map((swap) => ({
        deckA: a.id,
        deckB: a.id,
        seed: holdout
          ? `choom-development-holdout-v1/${a.id}/${block}`
          : `choom-development-v1/${a.id}`,
        opponent,
        swap,
      })),
    ),
  ).flat(),
);
mkdirSync(output, { recursive: true });
if (mode === "worker" || mode === "replay") {
  for (let i = shard; i < plan.length; i += mode === "replay" ? plan.length : workers) {
    const path = `${output}/${i}.json`;
    if (mode !== "replay" && existsSync(path)) continue;
    const spec = plan[i]!,
      a = pool.decks.find((d) => d.id === spec.deckA)!,
      b = pool.decks.find((d) => d.id === spec.deckB)!;
    const candidate = spec.opponent === "sharp-before" ? originalExpert() : candidateExpert();
    const baseline = spec.opponent === "expert" ? originalExpert() : tacticalStrategy;
    const start = performance.now();
    const result = runAutoMatch({
      players: createTestPlayers(),
      catalog,
      seed: spec.seed,
      decks: [deckListFromGenerated(a, "p1"), deckListFromGenerated(b, "p2")],
      strategies: spec.swap
        ? [bindStrategyToDeck(baseline, a), bindStrategyToDeck(candidate, b)]
        : [bindStrategyToDeck(candidate, a), bindStrategyToDeck(baseline, b)],
    });
    const dump = buildCoachDump(result, {
      seed: spec.seed,
      strategyA: spec.swap ? baseline.name : candidate.name,
      strategyB: spec.swap ? candidate.name : baseline.name,
      deckAId: a.id,
      deckBId: b.id,
    });
    const row = {
      index: i,
      ...spec,
      winner: result.winnerId,
      candidateWon: result.winnerId === (spec.swap ? "p2" : "p1"),
      reason: result.reason,
      failed: result.automationConcessionApplied,
      steps: result.stepCount,
      turns: result.turnCount,
      finalHash: result.finalStateHash,
      elapsedMs: performance.now() - start,
    };
    if (mode === "replay") {
      const original = JSON.parse(readFileSync(path, "utf8"));
      const { elapsedMs: _oldTime, ...oldRow } = original.row;
      const { elapsedMs: _newTime, ...newRow } = row;
      if (
        JSON.stringify(oldRow) !== JSON.stringify(newRow) ||
        JSON.stringify(original.dump) !== JSON.stringify(dump)
      )
        throw new Error(`Replay differs: ${i}`);
      console.log(`Replay ${i}: all moves, logs, events and terminal hash match.`);
    } else {
      writeFileSync(path, JSON.stringify({ row, dump }));
      console.log(JSON.stringify(row));
    }
  }
} else {
  const planPath = `${output}/plan.json`;
  if (
    existsSync(planPath) &&
    JSON.stringify(JSON.parse(readFileSync(planPath, "utf8"))) !== JSON.stringify(plan)
  )
    throw new Error("Plan differs: use a fresh directory.");
  writeFileSync(planPath, JSON.stringify(plan, null, 2));
  const provenancePath = `${output}/provenance.json`;
  if (
    existsSync(provenancePath) &&
    stableBotHash(JSON.parse(readFileSync(provenancePath, "utf8"))) !== stableBotHash(provenance)
  )
    throw new Error("Chooser, catalog or deck pool changed: use a fresh directory.");
  writeFileSync(provenancePath, JSON.stringify(provenance, null, 2));
  const children = Array.from({ length: workers }, (_, i) =>
    spawn(
      process.execPath,
      [
        fileURLToPath(import.meta.url),
        output,
        "worker",
        String(i),
        String(workers),
        ...(holdout ? ["--holdout"] : []),
      ],
      { stdio: "inherit" },
    ),
  );
  const codes = await Promise.all(
    children.map(
      (child) =>
        new Promise<number | null>((resolve, reject) => {
          child.once("error", reject);
          child.once("exit", resolve);
        }),
    ),
  );
  if (codes.some((code) => code !== 0)) throw new Error(`Failed workers: ${JSON.stringify(codes)}`);
  const rows: MatchRow[] = plan.map(
    (_, i) => JSON.parse(readFileSync(`${output}/${i}.json`, "utf8")).row,
  );
  const summary = Object.fromEntries(
    groups.map((group) => {
      const cell = rows.filter((r) => r.opponent === group);
      return [
        group,
        {
          games: cell.length,
          wins: cell.filter((r) => r.candidateWon).length,
          failures: cell.filter((r) => r.failed).length,
          terminations: Object.fromEntries(
            [...new Set(cell.map((r) => r.reason))].map((reason) => [
              reason,
              cell.filter((r) => r.reason === reason).length,
            ]),
          ),
          confidenceInterval: pairedBootstrapConfidenceInterval({
            blockDeltas: [...new Set(cell.map((r) => r.seed))].map((seed) => {
              const block = cell.filter((r) => r.seed === seed);
              return (
                block.reduce(
                  (sum, r) => sum + (r.failed ? -1 : r.candidateWon ? 1 : r.winner ? 0 : 0.5),
                  0,
                ) /
                  block.length -
                0.5
              );
            }),
            confidenceLevel: 0.95,
            seed: `${holdout ? "holdout" : "development"}/${group}/bootstrap`,
          }),
        },
      ];
    }),
  );
  writeFileSync(
    `${output}/report.json`,
    JSON.stringify(
      {
        hypothesis: "Value field Units independently of power to improve development.",
        ...provenance,
        scheduleHash: stableBotHash(plan),
        informationPolicy: "oracle",
        promotionEligible: false,
        deckCoverage: pool.coverage,
        summary,
        rows,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(summary, null, 2));
}
