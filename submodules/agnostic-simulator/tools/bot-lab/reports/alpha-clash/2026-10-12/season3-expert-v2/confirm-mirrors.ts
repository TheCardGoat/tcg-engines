import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildPairedSchedule, canonicalJson } from "@tcg/bot-core";
import { botCandidateManifestV1Schema, botMatchRecordV1Schema } from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";
import { resolveAlphaClashLabDeck } from "@tcg/alpha-clash-server-adapter/practice";
import { runAlphaClashPracticeMatch as legacy } from "./runner-v1.ts";
const file = (n: string) => new URL(n, import.meta.url);
const manifest = botCandidateManifestV1Schema.parse(
  JSON.parse(readFileSync(file("manifest.json"), "utf8")),
);
if (
  adapter.getEngineRevision() !== manifest.engineRevision ||
  adapter.getCardCatalogHash() !== manifest.cardCatalogHash
)
  throw Error("Frozen source drift");
const deckPairs = adapter
  .getPromotionDeckPairs("season3")
  .filter(
    (p) => p.deckA === p.deckB && ["season3-xiii-war", "season3-sloppy-valen"].includes(p.deckA),
  );
const schedule = buildPairedSchedule({
  suiteId: "war-valen-fresh-mirrors",
  seedBase: "alpha-clash-expert-v2-war-valen-confirmation",
  deckPairs,
  blocksPerPair: 10,
});
const tasks = schedule.matches.flatMap((match) => [
  { version: 1, match },
  { version: 2, match },
]);
if (tasks.length !== 80) throw Error("Expected 80 confirmation games");
const workers = 6;
if (process.argv[2] === undefined) {
  writeFileSync(
    file("confirm-plan.json"),
    JSON.stringify(
      {
        reason:
          "The first fresh War mirror sample is 4/6 for v2 versus 5/6 for v1. Keep the policy frozen and use ten additional fresh seed blocks for each of the two decks named in the task. This is a supplemental check, separate from the fixed 384-game suite.",
        engineRevision: manifest.engineRevision,
        cardCatalogHash: manifest.cardCatalogHash,
        workers,
        games: 80,
        schedule,
      },
      null,
      2,
    ) + "\n",
  );
  await Promise.all(
    Array.from(
      { length: workers },
      (_, n) =>
        new Promise<void>((resolve, reject) => {
          const child = spawn(process.execPath, [fileURLToPath(import.meta.url), String(n)], {
            stdio: "inherit",
          });
          child.on("error", reject);
          child.on("exit", (c) =>
            c === 0 ? resolve() : reject(Error(`confirmation worker ${n}: ${c}`)),
          );
        }),
    ),
  );
  const results = Array.from({ length: workers }, (_, n) =>
    readFileSync(file(`confirm-matches-${n}.jsonl`), "utf8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l)),
  ).flat();
  for (const r of results) botMatchRecordV1Schema.parse(r.record);
  if (
    results.length !== 80 ||
    new Set(results.map((r) => `${r.version}/${r.record.blockId}/${r.record.legId}`)).size !== 80
  )
    throw Error("Bad confirmation coverage");
  writeFileSync(
    file("confirm-report.json"),
    JSON.stringify(
      {
        engineRevision: manifest.engineRevision,
        cardCatalogHash: manifest.cardCatalogHash,
        seedBase: schedule.seedBase,
        blocksPerPair: 10,
        results,
      },
      null,
      2,
    ) + "\n",
  );
  for (const deck of deckPairs.map((p) => p.deckA))
    for (const version of [1, 2]) {
      const ms = results
        .filter((r) => r.version === version && r.record.candidateDeckId === deck)
        .map((r) => r.record);
      console.log(
        `${deck} v${version}: ${ms.filter((m) => m.winner === "candidate").length}/${ms.length}; ${ms.filter((m) => m.termination !== "rules-win").length} abnormal`,
      );
    }
} else {
  const index = Number(process.argv[2]);
  const journal = file(`confirm-matches-${index}.jsonl`);
  writeFileSync(journal, "");
  for (const { version, match } of tasks.filter((_, n) => n % workers === index)) {
    const seat = match.p1Controller === "candidate" ? "p1" : "p2";
    const deck = match.p1DeckId;
    const record =
      version === 2
        ? await adapter.runMatch({
            scheduledMatch: match,
            candidateManifest: manifest,
            baselineStrategyId: "meta-v1",
          })
        : legacy({
            ...match,
            shuffleSeed: match.seed.replace(/-seat-[12]$/, ""),
            candidateSeat: seat,
            candidateDeckId: deck,
            baselineDeckId: deck,
            candidateStrategyId: "expert-oracle",
            baselineStrategyId: "meta-v1",
            candidateDeck: resolveAlphaClashLabDeck(deck),
            baselineDeck: resolveAlphaClashLabDeck(deck),
          });
    appendFileSync(journal, canonicalJson({ version, record }) + "\n");
  }
}
