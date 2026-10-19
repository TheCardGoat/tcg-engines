import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonicalJson } from "@tcg/bot-core";
import { runAlphaClashPracticeMatch } from "./runner-v1.ts";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";
import { resolveAlphaClashLabDeck } from "@tcg/alpha-clash-server-adapter/practice";
import {
  botCandidateManifestV1Schema,
  botMatchRecordV1Schema,
  botEvaluationReportV1Schema,
} from "@tcg/bot-core/schemas";
const file = (n: string) => new URL(n, import.meta.url);
const manifest = botCandidateManifestV1Schema.parse(
  JSON.parse(readFileSync(file("manifest.json"), "utf8")),
);
if (
  adapter.getEngineRevision() !== manifest.engineRevision ||
  adapter.getCardCatalogHash() !== manifest.cardCatalogHash
)
  throw Error("Frozen source drift");
const schedule = JSON.parse(readFileSync(file("schedule.json"), "utf8"));
const tasks = schedule.matches.filter(
  (m: { p1DeckId: string; p2DeckId: string }) => m.p1DeckId === m.p2DeckId,
);
if (tasks.length !== 48) throw Error("Expected 48 fresh mirror controls");
const workers = 4;
if (process.argv[2] === undefined) {
  await Promise.all(
    Array.from(
      { length: workers },
      (_, index) =>
        new Promise<void>((resolve, reject) => {
          const child = spawn(process.execPath, [fileURLToPath(import.meta.url), String(index)], {
            stdio: "inherit",
          });
          child.on("error", reject);
          child.on("exit", (c) =>
            c === 0 ? resolve() : reject(Error(`control worker ${index}: ${c}`)),
          );
        }),
    ),
  );
  const matches = Array.from({ length: workers }, (_, n) =>
    readFileSync(file(`controls-v1-matches-${n}.jsonl`), "utf8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => botMatchRecordV1Schema.parse(JSON.parse(line))),
  ).flat();
  if (matches.length !== 48 || new Set(matches.map((m) => `${m.blockId}/${m.legId}`)).size !== 48)
    throw Error("Bad control coverage");
  writeFileSync(
    file("controls-v1.json"),
    JSON.stringify(
      {
        strategyVersion: "1",
        nativeEngineRevision: manifest.engineRevision,
        cardCatalogHash: manifest.cardCatalogHash,
        policySource: "investigation/source-v1",
        matches,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `v1 fresh mirrors: ${matches.filter((m) => m.winner === "candidate").length}/48, ${matches.filter((m) => m.termination !== "rules-win").length} abnormal`,
  );
} else {
  const index = Number(process.argv[2]);
  // Verify the relocated frozen policy against old records before using it as a control.
  if (index < 2) {
    const old = botEvaluationReportV1Schema.parse(
      JSON.parse(readFileSync(file("../season3-expert/report.json"), "utf8")),
    );
    const deck = index === 0 ? "season3-xiii-war" : "season3-sloppy-valen";
    const record = old.matches.find(
      (m) => m.candidateDeckId === deck && m.baselineDeckId === deck && m.winner === "baseline",
    )!;
    const replay = runAlphaClashPracticeMatch({
      ...record,
      shuffleSeed: record.seed.replace(/-seat-[12]$/, ""),
      candidateStrategyId: "expert-oracle",
      baselineStrategyId: "meta-v1",
      candidateDeck: resolveAlphaClashLabDeck(deck),
      baselineDeck: resolveAlphaClashLabDeck(deck),
    });
    if (canonicalJson(replay) !== canonicalJson(record))
      throw Error("Archived policy replay mismatch");
    writeFileSync(
      file(`controls-v1-proof-${index}.json`),
      JSON.stringify(
        {
          key: `${record.blockId}/${record.legId}`,
          matches: true,
          finalStateHash: replay.finalStateHash,
        },
        null,
        2,
      ) + "\n",
    );
  }
  const journal = file(`controls-v1-matches-${index}.jsonl`);
  writeFileSync(journal, "");
  for (const task of tasks.filter((_: unknown, n: number) => n % workers === index)) {
    const candidateSeat = task.p1Controller === "candidate" ? "p1" : "p2";
    const deck = task.p1DeckId;
    const record = runAlphaClashPracticeMatch({
      ...task,
      shuffleSeed: task.seed.replace(/-seat-[12]$/, ""),
      candidateSeat,
      candidateDeckId: deck,
      baselineDeckId: deck,
      candidateStrategyId: "expert-oracle",
      baselineStrategyId: "meta-v1",
      candidateDeck: resolveAlphaClashLabDeck(deck),
      baselineDeck: resolveAlphaClashLabDeck(deck),
    });
    appendFileSync(journal, canonicalJson(record) + "\n");
  }
}
