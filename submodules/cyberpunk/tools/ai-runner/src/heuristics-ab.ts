/**
 * Scratch A/B harness for heuristic validation (not part of the shipped tool).
 *
 * Seat A = tactical variant with `--a-off <flags>` disabled,
 * seat B = tactical variant with `--b-off <flags>` disabled.
 * Every pairing plays each seat order so first-player bias cancels.
 */
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import {
  parseHeuristicsAbConfig,
  parseHeuristicsAbProfileOverride,
  type HeuristicsAbConfig,
  type HeuristicsAbProfileOverride,
} from "./heuristics-ab-options.ts";

interface AbJob {
  seed: string;
  aIndex: number;
  bIndex: number;
  aSeat: "p1" | "p2";
}

interface AbOutcome {
  winnerIsA: boolean | null;
  reason: string;
  steps: number;
}

interface AbRequest {
  aOff: string[];
  bOff: string[];
  aConfig: HeuristicsAbConfig;
  bConfig: HeuristicsAbConfig;
  aPoverride: HeuristicsAbProfileOverride;
  bPoverride: HeuristicsAbProfileOverride;
  seed: string;
  aIndex: number;
  bIndex: number;
  aSeat: "p1" | "p2";
}

interface ParsedArgs {
  aOff: string[];
  bOff: string[];
  aConfig: HeuristicsAbConfig;
  bConfig: HeuristicsAbConfig;
  aPoverride: HeuristicsAbProfileOverride;
  bPoverride: HeuristicsAbProfileOverride;
  pairs: number;
  seeds: number;
  workers: number;
  probe: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    aOff: [],
    bOff: [],
    aConfig: {},
    bConfig: {},
    aPoverride: {},
    bPoverride: {},
    pairs: 45,
    seeds: 3,
    workers: 6,
    probe: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const value = argv[i + 1] ?? "";
    switch (argv[i]) {
      case "--a-off":
        args.aOff = value.split(",").filter(Boolean);
        i++;
        break;
      case "--b-off":
        args.bOff = value.split(",").filter(Boolean);
        i++;
        break;
      case "--a-config":
        args.aConfig = parseHeuristicsAbConfig(value);
        i++;
        break;
      case "--b-config":
        args.bConfig = parseHeuristicsAbConfig(value);
        i++;
        break;
      case "--a-poverride":
        args.aPoverride = parseHeuristicsAbProfileOverride(value);
        i++;
        break;
      case "--b-poverride":
        args.bPoverride = parseHeuristicsAbProfileOverride(value);
        i++;
        break;
      case "--pairs":
        args.pairs = Number(value);
        i++;
        break;
      case "--seeds":
        args.seeds = Number(value);
        i++;
        break;
      case "--workers":
        args.workers = Number(value);
        i++;
        break;
      case "--probe":
        args.probe = true;
        break;
    }
  }
  return args;
}

async function runJobInWorker(request: AbRequest): Promise<AbOutcome> {
  const workerUrl = new URL("./heuristics-ab.worker.ts", import.meta.url);
  return new Promise((resolve, reject) => {
    const worker = new Worker(fileURLToPath(workerUrl), {
      workerData: request,
      execArgv: ["--experimental-transform-types"],
    });
    worker.on("message", (outcome: AbOutcome) => resolve(outcome));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`worker exited ${code}`));
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { createLegalDeckPool } = await import("./legal-decks.ts");
  const pool = createLegalDeckPool("authored-botlab");
  const decks = pool.decks;
  const jobs: AbJob[] = [];
  let placed = 0;
  for (let a = 0; a < decks.length && placed < args.pairs; a++) {
    for (let b = a + 1; b < decks.length && placed < args.pairs; b++) {
      placed += 1;
      for (let match = 0; match < args.seeds; match++) {
        // Paired design: both seat orders reuse one seed so the deck shuffle
        // is identical and only the first player flips.
        const base = `ab/${decks[a]!.id}-vs-${decks[b]!.id}/match-${match}`;
        jobs.push({ seed: base, aIndex: a, bIndex: b, aSeat: "p1" });
        jobs.push({ seed: base, aIndex: a, bIndex: b, aSeat: "p2" });
      }
    }
  }
  if (args.probe) {
    const outcome = await runJobInWorker({
      aOff: args.aOff,
      bOff: args.bOff,
      aConfig: args.aConfig,
      bConfig: args.bConfig,
      aPoverride: args.aPoverride,
      bPoverride: args.bPoverride,
      seed: `ab/${decks[0]!.id}-vs-${decks[1]!.id}/match-0/seat-a-p1`,
      aIndex: 0,
      bIndex: 1,
      aSeat: "p1",
    });
    console.log("probe", JSON.stringify(outcome));
    return;
  }

  const startedAt = Date.now();
  const failures: string[] = [];
  let aWins = 0;
  let aLosses = 0;
  let draws = 0;
  let totalSteps = 0;
  let cursor = 0;
  const results = new Map<string, Array<boolean | null>>();
  const worker = async () => {
    for (;;) {
      const job = jobs[cursor++];
      if (!job) return;
      const outcome = await runJobInWorker({
        aOff: args.aOff,
        bOff: args.bOff,
        aConfig: args.aConfig,
        bConfig: args.bConfig,
        aPoverride: args.aPoverride,
        bPoverride: args.bPoverride,
        seed: job.seed,
        aIndex: job.aIndex,
        bIndex: job.bIndex,
        aSeat: job.aSeat,
      });
      totalSteps += outcome.steps;
      if (
        outcome.reason === "stuck" ||
        outcome.reason === "illegal" ||
        outcome.reason === "repeatedState"
      ) {
        failures.push(`${job.seed}/${job.aSeat} ${outcome.reason}`);
      }
      if (outcome.winnerIsA === null) draws += 1;
      else if (outcome.winnerIsA) aWins += 1;
      else aLosses += 1;
      const pairResults = results.get(job.seed) ?? [];
      pairResults.push(outcome.winnerIsA);
      results.set(job.seed, pairResults);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, args.workers) }, worker));

  let pairs = 0;
  let aSweeps = 0;
  let bSweeps = 0;
  let splits = 0;
  for (const pairResults of results.values()) {
    if (pairResults.length !== 2) continue;
    pairs += 1;
    const [first, second] = pairResults as [boolean | null, boolean | null];
    const aNet =
      (first === true ? 1 : first === false ? -1 : 0) +
      (second === true ? 1 : second === false ? -1 : 0);
    if (aNet > 0) aSweeps += 1;
    else if (aNet < 0) bSweeps += 1;
    else splits += 1;
  }

  const decided = aWins + aLosses;
  console.log(
    JSON.stringify(
      {
        aOff: args.aOff,
        bOff: args.bOff,
        aConfig: args.aConfig,
        bConfig: args.bConfig,
        aPoverride: args.aPoverride,
        bPoverride: args.bPoverride,
        games: decided + draws,
        aWins,
        aLosses,
        draws,
        aWinRate: decided === 0 ? 0 : Number((aWins / decided).toFixed(4)),
        pairs,
        aSweeps,
        bSweeps,
        splits,
        pairedImprovement: pairs === 0 ? 0 : Number(((aSweeps - bSweeps) / pairs).toFixed(4)),
        failures,
        avgSteps: Number((totalSteps / (decided + draws)).toFixed(1)),
        elapsedMs: Date.now() - startedAt,
      },
      null,
      2,
    ),
  );
}

await main();
