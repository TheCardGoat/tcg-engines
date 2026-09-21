import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { CoachMatchDump, CoachDumpStep } from "@tcg/cyberpunk-engine";
import { authoredBotLabDeckSpecs } from "./authored-decks.ts";
import { deckProfileFor } from "./deck-profiles.ts";

export interface SelfImproveJournalRow {
  deckId: string;
  iteration: number;
  seed: string;
  dumpPath: string;
  priorDumpPath: string;
  reason: string;
  winner: string;
  mistake: string;
  keep: "keep" | "reject" | "n/a";
  flowGap: string;
  usedFlow: string;
}

export const FLOW_GAP_NONE = "none";

export const FLOW_GAPS = {
  namedDeckSeating: "named-deck-seating",
  dumpMissingMoves: "dump-missing-moves",
  dumpMissingLogs: "dump-missing-logs",
  journalResume: "journal-resume",
  keepGate: "keep-gate",
} as const;

/**
 * Flow gaps already folded into the shipped loop. Structural dump defects
 * are still named when this dump lacks them. `keep-gate` means the loop can
 * record keep/reject; a heuristic miss still names it until that row's
 * `keep` is no longer `n/a`.
 */
export const CLOSED_FLOW_GAPS: ReadonlySet<string> = new Set([
  FLOW_GAPS.namedDeckSeating,
  FLOW_GAPS.dumpMissingMoves,
  FLOW_GAPS.dumpMissingLogs,
  FLOW_GAPS.journalResume,
  FLOW_GAPS.keepGate,
]);

const HUNG = new Set(["stuck", "illegal", "repeatedState", "maxSteps"]);

export interface CoachWalkOptions {
  /** Path of this deck's previous dump; required for iteration > 1. */
  priorDumpPath?: string;
  /** Keep/reject recorded on the previous row; n+1 usedFlow includes keep-gate. */
  priorKeep?: SelfImproveJournalRow["keep"];
  iteration?: number;
  closedFlowGaps?: ReadonlySet<string>;
}

export interface CoachWalkResult {
  mistake: string;
  keep: SelfImproveJournalRow["keep"];
  flowGap: string;
  usedFlow: string;
}

/**
 * Walk every dump step in order (moves and game logs) and name at most one
 * coach mistake. Then reflect on the loop itself: named flow gap vs reasoned
 * none. The LLM does not pick this; it reads the same dump.
 */
export function coachWalkDump(dump: CoachMatchDump, opts: CoachWalkOptions = {}): CoachWalkResult {
  const mistake = nameMistake(dump);
  const keep: SelfImproveJournalRow["keep"] = "n/a";
  const used: string[] = [];
  if (dump.deckAId) used.push(FLOW_GAPS.namedDeckSeating);
  if (opts.priorDumpPath) used.push(FLOW_GAPS.journalResume);
  if (opts.priorKeep === "keep" || opts.priorKeep === "reject") {
    used.push(FLOW_GAPS.keepGate);
  }

  const flowGap = nameFlowGap(dump, mistake, keep, opts);
  return { mistake, keep, flowGap, usedFlow: used.length > 0 ? used.join(",") : FLOW_GAP_NONE };
}

export function isNamedFlowGap(flowGap: string): boolean {
  return flowGap !== FLOW_GAP_NONE && flowGap.length > 0;
}

function nameMistake(dump: CoachMatchDump): string {
  if (HUNG.has(dump.reason)) return `hung:${dump.reason}`;
  const profile = deckProfileFor(dump.deckAId ?? "");
  const core = new Set(profile?.coreCards ?? []);
  const legendHosts = preferredLegendHostNames(profile);
  const inPlay = new Map<string, Map<string, string>>();
  const namesById = new Map<string, string>();
  for (const step of dump.steps) {
    harvestNames(step, namesById);
    const line = walkStep(step, core, legendHosts, inPlay);
    applyBoard(step, inPlay, namesById);
    if (line) return line;
  }
  return "sound";
}

export function isHeuristicMistake(mistake: string): boolean {
  return mistake.startsWith("sold-engine:") || mistake.startsWith("early-go-solo:");
}

function nameFlowGap(
  dump: CoachMatchDump,
  mistake: string,
  keep: SelfImproveJournalRow["keep"],
  opts: CoachWalkOptions,
): string {
  const acted = dump.steps.filter((step) => step.kind === "acted" && step.move);
  if (acted.length === 0) return FLOW_GAPS.dumpMissingMoves;
  const logs = dump.steps.reduce((n, step) => n + step.moveLogs.length + step.gameEvents.length, 0);
  if (logs === 0) return FLOW_GAPS.dumpMissingLogs;
  if (!dump.deckAId) return FLOW_GAPS.namedDeckSeating;
  const iteration = opts.iteration ?? 1;
  if (iteration > 1 && !opts.priorDumpPath) return FLOW_GAPS.journalResume;
  if (isHeuristicMistake(mistake) && keep === "n/a") return FLOW_GAPS.keepGate;
  return FLOW_GAP_NONE;
}

function preferredLegendHostNames(profile: ReturnType<typeof deckProfileFor>): ReadonlySet<string> {
  const names = new Set<string>();
  if (!profile?.gearHosts) return names;
  for (const [gear, hosts] of Object.entries(profile.gearHosts)) {
    if (profile.gearHostTypes?.[gear] === "unit") continue;
    for (const host of hosts) names.add(host);
  }
  return names;
}

function namesMatch(left: string, right: string): boolean {
  return left === right || left.startsWith(`${right}:`) || right.startsWith(`${left}:`);
}

function matchesAny(name: string, pool: ReadonlySet<string>): boolean {
  return [...pool].some((item) => namesMatch(name, item));
}

function coreKey(name: string, core: ReadonlySet<string>): string | undefined {
  return [...core].find((item) => namesMatch(name, item));
}

function harvestNames(step: CoachDumpStep, namesById: Map<string, string>): void {
  const take = (record: Record<string, unknown>): void => {
    const id = record.cardId;
    const name = record.cardName;
    if (typeof id === "string" && typeof name === "string") namesById.set(id, name);
    const params = record.params;
    if (params && typeof params === "object") {
      const p = params as Record<string, unknown>;
      const fromParams = p.cardName;
      if (typeof id === "string" && typeof fromParams === "string") namesById.set(id, fromParams);
    }
  };
  for (const log of step.moveLogs) take(log as Record<string, unknown>);
  for (const event of step.gameEvents) take(event as Record<string, unknown>);
}

function stepDisplayName(step: CoachDumpStep): string {
  const solo = goSoloCardName(step);
  if (solo) return solo;
  const sold = step.moveLogs.find((log) => log.type === "sellCard");
  return sold?.type === "sellCard" && typeof sold.cardName === "string" ? sold.cardName : "";
}

function applyBoard(
  step: CoachDumpStep,
  inPlay: Map<string, Map<string, string>>,
  namesById: Map<string, string>,
): void {
  const fallbackName = stepDisplayName(step);
  for (const event of step.gameEvents) {
    if (event.type !== "cardMoved") continue;
    const id = event.cardId;
    const playerId = event.playerId;
    const toZone = event.toZone;
    const fromZone = event.fromZone;
    if (typeof id !== "string" || typeof playerId !== "string") continue;
    const board = inPlay.get(playerId) ?? new Map<string, string>();
    if (toZone === "field" || toZone === "legendArea") {
      const name = namesById.get(id) ?? fallbackName;
      if (name) {
        namesById.set(id, name);
        board.set(id, name);
      }
      inPlay.set(playerId, board);
    }
    if (fromZone === "field" || fromZone === "legendArea") {
      board.delete(id);
      inPlay.set(playerId, board);
    }
  }
}

function extraCoreAlreadyInPlay(
  inPlay: Map<string, Map<string, string>>,
  playerId: string,
  soldName: string,
  soldId: string | undefined,
  core: ReadonlySet<string>,
): boolean {
  const key = coreKey(soldName, core);
  if (!key) return false;
  const board = inPlay.get(playerId);
  if (!board) return false;
  for (const [id, name] of board) {
    if (id !== soldId && coreKey(name, core) === key) return true;
  }
  return false;
}

function goSoloCardName(step: CoachDumpStep): string {
  for (const log of step.moveLogs) {
    const params = (log as { params?: { cardName?: unknown } }).params;
    if (typeof params?.cardName === "string") return params.cardName;
  }
  return "";
}

function walkStep(
  step: CoachDumpStep,
  core: ReadonlySet<string>,
  legendHosts: ReadonlySet<string>,
  inPlay: Map<string, Map<string, string>>,
): string | undefined {
  if (step.kind === "illegal") return `illegal:${step.move ?? step.reason ?? "unknown"}`;
  if (step.kind === "stuck") return `hung:stuck`;
  if (step.move === "goSolo" && (step.stepIndex ?? 0) < 40) {
    const name = goSoloCardName(step);
    if (name && matchesAny(name, legendHosts)) {
      return `early-go-solo:step-${step.stepIndex}`;
    }
  }
  if (step.move === "sellCard") {
    const sold = step.moveLogs.find((log) => log.type === "sellCard");
    if (sold?.type !== "sellCard") return undefined;
    const name = typeof sold.cardName === "string" ? sold.cardName : "";
    const soldId = typeof sold.cardId === "string" ? sold.cardId : undefined;
    if (name && coreKey(name, core)) {
      if (extraCoreAlreadyInPlay(inPlay, step.playerId, name, soldId, core)) return undefined;
      return `sold-engine:${name}:step-${step.stepIndex}`;
    }
  }
  return undefined;
}

/** True until a named gap is addressed. keep-gate unblocks only after keep/reject. */
export function isDeckBlocked(
  prior: SelfImproveJournalRow,
  closed: ReadonlySet<string> = CLOSED_FLOW_GAPS,
): boolean {
  if (!isNamedFlowGap(prior.flowGap)) return false;
  if (prior.flowGap === FLOW_GAPS.keepGate) return prior.keep === "n/a";
  const dump = JSON.parse(readFileSync(prior.dumpPath, "utf8")) as CoachMatchDump;
  const walk = coachWalkDump(dump, {
    iteration: prior.iteration,
    closedFlowGaps: closed,
    priorDumpPath: prior.priorDumpPath || undefined,
    priorKeep: undefined,
  });
  return walk.flowGap === prior.flowGap;
}

export function recordKeep(opts: {
  journalJsonl: string;
  journalMarkdown?: string;
  deckId: string;
  keep: "keep" | "reject";
}): SelfImproveJournalRow {
  const rows = readJournalJsonl(opts.journalJsonl);
  const last = lastJournalRowForDeck(rows, opts.deckId);
  if (!last) throw new Error(`recordKeep: no journal row for ${opts.deckId}`);
  if (last.keep !== "n/a") {
    throw new Error(`recordKeep: ${opts.deckId} keep is already ${last.keep}`);
  }
  if (last.flowGap !== FLOW_GAPS.keepGate && !isHeuristicMistake(last.mistake)) {
    throw new Error(`recordKeep: ${opts.deckId} last row is not a keep-gate`);
  }
  const used =
    last.usedFlow === FLOW_GAP_NONE || last.usedFlow.length === 0
      ? FLOW_GAPS.keepGate
      : last.usedFlow.includes(FLOW_GAPS.keepGate)
        ? last.usedFlow
        : `${last.usedFlow},${FLOW_GAPS.keepGate}`;
  const updated: SelfImproveJournalRow = { ...last, keep: opts.keep, usedFlow: used };
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i]?.deckId === opts.deckId) {
      rows[i] = updated;
      break;
    }
  }
  writeJournalJsonl(opts.journalJsonl, rows);
  if (opts.journalMarkdown) writeJournalMarkdown(opts.journalMarkdown, rows);
  return updated;
}

export function writeJournalJsonl(path: string, rows: readonly SelfImproveJournalRow[]): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
}

export function lastJournalRowForDeck(
  rows: readonly SelfImproveJournalRow[],
  deckId: string,
): SelfImproveJournalRow | undefined {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i]?.deckId === deckId) return rows[i];
  }
  return undefined;
}

export function formatJournalRow(row: SelfImproveJournalRow): string {
  const prior = row.priorDumpPath ? `\`${row.priorDumpPath}\`` : "-";
  return `| ${row.deckId} | ${row.iteration} | \`${row.seed}\` | \`${row.dumpPath}\` | ${prior} | ${row.reason}/${row.winner} | ${row.mistake} | ${row.keep} | ${row.flowGap} | ${row.usedFlow} |`;
}

export function writeJournalMarkdown(path: string, rows: readonly SelfImproveJournalRow[]): void {
  mkdirSync(dirname(path), { recursive: true });
  const header = [
    "# Self-improve iterations",
    "",
    "| deckId | iteration | seed | dump | priorDump | reason/winner | mistake | keep | flowGap | usedFlow |",
    "|---|---:|---|---|---|---|---|---|---|---|",
    ...rows.map(formatJournalRow),
    "",
  ].join("\n");
  writeFileSync(path, header, "utf8");
}

export function appendJournalJsonl(path: string, row: SelfImproveJournalRow): void {
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${JSON.stringify(row)}\n`, "utf8");
}

export function readJournalJsonl(path: string): SelfImproveJournalRow[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as SelfImproveJournalRow);
}

export function rewalkClosedLoop(opts: {
  dumpDir: string;
  iterations: number;
  closedFlowGaps?: ReadonlySet<string>;
  deckIds?: readonly string[];
}): SelfImproveJournalRow[] {
  const closed = new Set(opts.closedFlowGaps ?? []);
  const specs = opts.deckIds
    ? authoredBotLabDeckSpecs.filter((spec) => opts.deckIds!.includes(spec.id))
    : authoredBotLabDeckSpecs;
  const rows: SelfImproveJournalRow[] = [];
  for (const spec of specs) {
    for (let iteration = 1; iteration <= opts.iterations; iteration++) {
      const dumpPath = join(opts.dumpDir, spec.id, `iter-${iteration}.json`);
      const dump = JSON.parse(readFileSync(dumpPath, "utf8")) as CoachMatchDump;
      const prior = lastJournalRowForDeck(rows, spec.id);
      const walk = coachWalkDump(dump, {
        priorDumpPath: prior?.dumpPath,
        priorKeep: prior?.keep,
        iteration,
        closedFlowGaps: closed,
      });
      const row: SelfImproveJournalRow = {
        deckId: spec.id,
        iteration,
        seed: dump.seed,
        dumpPath,
        priorDumpPath: prior?.dumpPath ?? "",
        reason: dump.reason,
        winner: dump.winnerId ?? "draw",
        mistake: walk.mistake,
        keep: walk.keep,
        flowGap: walk.flowGap,
        usedFlow: walk.usedFlow,
      };
      rows.push(row);
      if (isNamedFlowGap(walk.flowGap)) break;
    }
  }
  return rows;
}
