import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { canonicalJson } from "@tcg/bot-core";
import { botCandidateManifestV1Schema, botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";

import { evaluateCandidate } from "./evaluate.ts";
import { planPromotion } from "./promote.ts";
import { getBotLabAdapter, listBotLabGames } from "./registry.ts";

type Flags = Record<string, string | boolean>;

function parseFlags(args: readonly string[]): Flags {
  const flags: Flags = {};
  for (let index = 0; index < args.length; index++) {
    const token = args[index];
    if (!token?.startsWith("--")) continue;
    const key = token.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) flags[key] = true;
    else {
      flags[key] = value;
      index++;
    }
  }
  return flags;
}

function required(flags: Flags, name: string): string {
  const value = flags[name];
  if (typeof value !== "string") throw new Error(`--${name} is required`);
  return value;
}

function resolveUserPath(path: string): string {
  return resolve(process.env.INIT_CWD ?? process.cwd(), path);
}

function writeJson(path: string, value: unknown): void {
  const absolute = resolveUserPath(path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, `${canonicalJson(value)}\n`);
}

async function main(): Promise<void> {
  const [command = "help", ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);

  if (command === "help") {
    console.log("bot-lab doctor|train|evaluate|replay|promote|gauntlet --game <id> [options]");
    console.log(
      "Cyberpunk reference: --reference choombattler --reference-worker <local.js> --reference-catalog <local.json>; reference-manifest --out <manifest.json>",
    );
    console.log(`registered games: ${listBotLabGames().join(", ") || "none"}`);
    return;
  }

  const game = required(flags, "game");
  if (command === "gauntlet") {
    if (game !== "cyberpunk") throw new Error("This gauntlet supports Cyberpunk");
    const { runCyberpunkGauntlet } = await import("./cyberpunk-gauntlet.ts");
    await runCyberpunkGauntlet({
      directory: resolveUserPath(required(flags, "out")),
      workers: Number(flags.workers ?? 8),
      workerPath: resolveUserPath(required(flags, "reference-worker")),
      catalogPath: resolveUserPath(required(flags, "reference-catalog")),
      deckIds:
        flags.decks === undefined
          ? undefined
          : required(flags, "decks")
              .split(",")
              .map((id) => id.trim()),
      seedBase: flags["seed-base"] === undefined ? undefined : required(flags, "seed-base"),
    });
    return;
  }
  if (flags.reference && (game !== "cyberpunk" || flags.reference !== "choombattler")) {
    throw new Error("The supported reference is --game cyberpunk --reference choombattler");
  }
  const adapter =
    flags.reference === "choombattler"
      ? (
          await import("./adapters/cyberpunk-reference/adapter.ts")
        ).createChoombattlerReferenceAdapter(
          resolveUserPath(required(flags, "reference-worker")),
          resolveUserPath(required(flags, "reference-catalog")),
        )
      : await getBotLabAdapter(game);
  if (command === "reference-manifest") {
    if (flags.reference !== "choombattler")
      throw new Error("reference-manifest requires --reference choombattler");
    const suiteId = typeof flags.suite === "string" ? flags.suite : "reference-authored";
    const blocks = adapter.getPromotionDeckPairs(suiteId).length;
    writeJson(required(flags, "out"), {
      schemaVersion: 1,
      game,
      candidateId: "expert-oracle",
      parentStrategyId: "choombattler-expert",
      informationPolicy: "oracle",
      hypothesis:
        "Compare our Expert chooser with the original pinned Choombattler Expert on one native engine",
      engineRevision: adapter.getEngineRevision(),
      cardCatalogHash: adapter.getCardCatalogHash(),
      adapterVersion: adapter.adapterVersion,
      changes: {},
      evaluation: {
        suiteId,
        seedBase: typeof flags.seed === "string" ? flags.seed : "choombattler-reference-v1",
        minimumBlocks: blocks,
        maximumBlocks: blocks,
        batchSize: blocks,
        confidenceLevel: 0.95,
        minimumMeanImprovement: 0,
        maximumCellRegression: 1,
      },
    });
    return;
  }
  if (command === "doctor") {
    const result = await adapter.doctor();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
    return;
  }
  if (command === "train") {
    if (!adapter.train) throw new Error(`${adapter.game} does not provide a trainer`);
    const plan = JSON.parse(
      readFileSync(resolveUserPath(required(flags, "manifest")), "utf8"),
    ) as unknown;
    const candidate = await adapter.train(plan);
    writeJson(required(flags, "out"), candidate);
    return;
  }
  if (command === "evaluate") {
    const manifest = botCandidateManifestV1Schema.parse(
      JSON.parse(readFileSync(resolveUserPath(required(flags, "candidate")), "utf8")),
    );
    const report = await evaluateCandidate({ adapter, manifest });
    writeJson(required(flags, "out"), report);
    console.log(`${report.verdict}: ${report.verdictReasons.join("; ")}`);
    return;
  }
  if (command === "replay") {
    const report = botEvaluationReportV1Schema.parse(
      JSON.parse(readFileSync(resolveUserPath(required(flags, "report")), "utf8")),
    );
    const matchId = required(flags, "match");
    const match = report.matches.find((entry) => `${entry.blockId}/${entry.legId}` === matchId);
    if (!match) throw new Error(`Match not found: ${matchId}`);
    const replayed = await adapter.replayMatch(match, report);
    if (canonicalJson(replayed) !== canonicalJson(match)) throw new Error("Replay mismatch");
    console.log(`replay verified: ${matchId}`);
    return;
  }
  if (command === "promote") {
    const report = botEvaluationReportV1Schema.parse(
      JSON.parse(readFileSync(resolveUserPath(required(flags, "report")), "utf8")),
    );
    const promotion = planPromotion({ adapter, report });
    if (flags["dry-run"] === true) {
      console.log(JSON.stringify(promotion, null, 2));
      return;
    }
    for (const write of promotion.writes) writeJson(write.path, JSON.parse(write.content));
    console.log(`promoted ${promotion.record.promotedStrategyId}`);
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
