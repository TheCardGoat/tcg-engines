import { mkdirSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";
import { stableBotHash } from "@tcg/bot-core";
import {
  effectiveAttack,
  effectiveDefense,
  effectiveKeywords,
  type AcCommand,
  type MatchState,
} from "../../../../alpha-clash/packages/engine/src/index.ts";
import { resolveAlphaClashLabDeck } from "../src/adapters/alpha-clash/decks.ts";
import { runAlphaClashPracticeMatch } from "../src/adapters/alpha-clash/runner.ts";
import { createAlphaClashRulesAudit } from "./alpha-clash-audit-checks.ts";
import { alphaClashBotLabAdapter } from "../src/adapters/alpha-clash.ts";

// These invariants establish structural consistency, not card correctness.
// Full state traces are kept for independent rules review.
const output = resolve(process.argv[2] ?? "reports/alpha-clash/2026-10-07/log-audit");
mkdirSync(output, { recursive: true });
const summaries = [];
function snapshotFrame(state: MatchState, command: AcCommand | undefined, logOffset: number) {
  const { definitions: _ignored, moveLog: _ignoredLogs, ...runtime } = state;
  const stats = Object.fromEntries(
    Object.values(state.cards)
      .filter((card) => ["clash", "contender", "accessory", "clashground"].includes(card.zone))
      .map((card) => [
        card.instanceId,
        {
          attack: effectiveAttack(state, card.instanceId),
          defense: effectiveDefense(state, card.instanceId),
          keywords: effectiveKeywords(state, card.instanceId),
        },
      ]),
  );
  return structuredClone({
    command: command ?? null,
    runtime,
    stats,
    logs: state.moveLog.slice(logOffset),
  });
}
for (const [index, candidateSeat] of (["p1", "p2"] as const).entries()) {
  const frames: unknown[] = [];
  const text: string[] = [];
  const failures: string[] = [];
  const rulesAudit = createAlphaClashRulesAudit();
  const coverage = new Map<string, Set<string>>();
  let previousLogCount = 0;
  const input = {
    blockId: "rules-audit",
    legId: `game-${index + 1}`,
    seed: `alpha-clash-rules-audit-2026-10-07-${index + 1}`,
    candidateSeat,
    candidateDeckId: "clarity-hyper-aggro",
    baselineDeckId: "absence-makati",
    candidateStrategyId: "meta-v3",
    baselineStrategyId: "meta-v3",
    candidateDeck: resolveAlphaClashLabDeck("clarity-hyper-aggro"),
    baselineDeck: resolveAlphaClashLabDeck("absence-makati"),
  };
  let definitions: MatchState["definitions"] = {};
  const record = runAlphaClashPracticeMatch({
    ...input,
    observe(state, command) {
      rulesAudit.observe(state, command);
      definitions = state.definitions;
      const logs = state.moveLog.slice(previousLogCount);
      previousLogCount = state.moveLog.length;
      frames.push(snapshotFrame(state, command, previousLogCount - logs.length));
      const label = (id: string) => {
        const card = state.cards[id];
        return card ? `${id} (${state.definitions[card.definitionId]?.name})` : id;
      };
      const heading = `# ${frames.length - 1}: turn ${state.turnNumber}, ${state.activePlayer}, ${state.phase.name}, health ${state.players["player-one"].health}/${state.players["player-two"].health}`;
      text.push(heading, JSON.stringify(command ?? { type: "setup" }));
      if (command && "cardId" in command) {
        const card = state.cards[command.cardId];
        if (card) {
          const name = state.definitions[card.definitionId]!.name;
          const actions = coverage.get(name) ?? new Set<string>();
          actions.add(command.type);
          coverage.set(name, actions);
          text.push(`Card: ${label(command.cardId)}`);
        }
      }
      text.push(...logs.map((log) => `${log.sequence} [${log.type}] ${log.message}`));
      if (state.pendingChoices.length)
        text.push(`Choices: ${JSON.stringify(state.pendingChoices)}`);
      text.push("");
      for (const player of Object.values(state.players)) {
        if (player.health > player.maxHealth) failures.push(`${heading}: health exceeds maximum`);
        const deck = state.deckOrder[player.id];
        if (new Set(deck).size !== deck.length)
          failures.push(`${heading}: duplicate deck instance`);
        const expected = Object.values(state.cards)
          .filter((card) => card.owner === player.id && card.zone === "deck")
          .map((card) => card.instanceId)
          .sort();
        if (JSON.stringify([...deck].sort()) !== JSON.stringify(expected))
          failures.push(`${heading}: deck zone/order mismatch`);
      }
      for (const card of Object.values(state.cards)) {
        if (
          ["deck", "hand", "oblivion", "banished"].includes(card.zone) &&
          card.controller !== card.owner
        )
          failures.push(`${heading}: owner-zone control mismatch ${card.instanceId}`);
        if (state.phase.name === "primary" && card.clashDamage !== 0)
          failures.push(`${heading}: clash damage persisted into Primary ${card.instanceId}`);
      }
      if (Object.values(state.cards).filter((card) => card.zone === "clashground").length > 1)
        failures.push(`${heading}: multiple Clashgrounds`);
      if (command?.type === "initiateClash" && state.turnNumber === 1)
        failures.push(`${heading}: first-turn attack`);
    },
  });
  const rerunFrames: unknown[] = [];
  let replayLogOffset = 0;
  const rerun = runAlphaClashPracticeMatch({
    ...input,
    observe(state, command) {
      rerunFrames.push(snapshotFrame(state, command, replayLogOffset));
      replayLogOffset = state.moveLog.length;
    },
  });
  const replayMatches =
    JSON.stringify(record) === JSON.stringify(rerun) &&
    JSON.stringify(frames) === JSON.stringify(rerunFrames);
  const trace = { input, definitions, record, frames };
  const game = `game-${index + 1}`;
  writeFileSync(resolve(output, `${game}.json.gz`), gzipSync(JSON.stringify(trace), { level: 9 }));
  writeFileSync(resolve(output, `${game}.log.txt`), text.join("\n"));
  summaries.push({
    game,
    ...record,
    p1Deck: candidateSeat === "p1" ? input.candidateDeckId : input.baselineDeckId,
    p2Deck: candidateSeat === "p2" ? input.candidateDeckId : input.baselineDeckId,
    traceHash: stableBotHash(trace),
    replayMatches,
    structuralFailures: failures,
    rulesAudit: rulesAudit.result(),
    commandCoverage: Object.fromEntries(
      [...coverage].map(([name, actions]) => [name, [...actions].sort()]),
    ),
  });
}
writeFileSync(
  resolve(output, "summary.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      engineRevision: alphaClashBotLabAdapter.getEngineRevision(),
      cardCatalogHash: alphaClashBotLabAdapter.getCardCatalogHash(),
      fullRulesReady: false,
      openIssues: [
        "General triggered-effect response priority and player-selected ordering of same-player trigger batches are not fully modeled (603.3, 605.1).",
      ],
      note: "Checks cover specified paths only. See the companion review for limits and open issues.",
      games: summaries,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    summaries.map(({ commandCoverage: _coverage, ...summary }) => summary),
    null,
    2,
  ),
);
if (
  summaries.some(
    (game) =>
      !game.replayMatches ||
      game.termination !== "rules-win" ||
      game.structuralFailures.length ||
      game.rulesAudit.failures.length,
  )
)
  process.exitCode = 1;
