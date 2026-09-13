/**
 * Headless dual-viewer FaB log audit.
 *
 * Runs bot-vs-bot practice matches on the same engine wiring the practice
 * simulator uses (createFabPracticeMatch + automated strategies), collects the
 * canonical move logs every command produces, and re-projects the history
 * through the simulator's log projection for each viewer perspective:
 *
 * - owner view:     a seat's own projection, private appendix included
 *                   (the sidebar "Yours" scope)
 * - reader view:    the other seat's projection of the same history
 * - spectator view: includePrivate: false (the sidebar "Public" scope)
 *
 * Fails (exit 1) on any privacy leak, registry drift, or render defect, and
 * prints which registry keys the corpus exercised.
 *
 * Usage:
 *   bun scripts/fab-log-audit.ts [--matchups N] [--matches N] [--strategy id]
 *     [--seed-base s] [--max-actions N] [--verbose]
 */

import {
  chooseAutomatedAction,
  concedeCommand,
  createFabPracticeMatch,
  DEFAULT_BOT_DECK_ID,
  DEFAULT_PLAYER_DECK_ID,
  getSafeFabAutomatedActionStrategyOption,
  isFabTournamentDeck,
  listFabDecks,
  listLegalCommands,
  seatMustAct,
  submitAutomatedAction,
  type FabLegalCommand,
} from "@tcg/flesh-and-blood-engine/automation";
import { fleshAndBloodDeckCardLibrary } from "@tcg/flesh-and-blood-cards/deck-library";
import {
  FAB_LOG_KEYS,
  FAB_LOG_KEY_CATEGORIES,
  renderFabLogTemplate,
  type FabLogKey,
} from "@tcg/flesh-and-blood-engine/log";
import type { FabMoveLog, FabMoveLogMessage } from "@tcg/flesh-and-blood-engine/simulator";

import {
  projectFabLogEntries,
  renderFabMoveLogMessage,
  type FabLogActorLabel,
} from "../src/games/flesh-and-blood/log-projection.ts";

/** Owner-view labels with possessive grammar for ownership slots. */
function ownerViewLabel(seat: string, seats: readonly string[]): FabLogActorLabel {
  return (actorId, usage) => {
    if (actorId === seat) {
      return usage === "possessive" ? "Your" : usage === "possessive-lower" ? "your" : "You";
    }
    if (seats.includes(actorId)) {
      return usage === "possessive"
        ? "Opponent's"
        : usage === "possessive-lower"
          ? "their"
          : "Opponent";
    }
    return undefined;
  };
}

/** Keys whose facts must only ever ride a private appendix, never `public`. */
const PRIVATE_FAMILY_KEYS: ReadonlySet<string> = new Set([
  "flesh-and-blood.draw.private",
  "flesh-and-blood.look.private",
  "flesh-and-blood.opt.private",
  "flesh-and-blood.search.found",
  "flesh-and-blood.decision.private",
]);

/** Value keys that carry card names, comma-joined when plural. */
const CARD_NAME_VALUE_KEYS = [
  "cardName",
  "cardNames",
  "topNames",
  "bottomNames",
  "revealedNames",
] as const;

const NON_NAME_PLACEHOLDERS = new Set(["nothing", "a card"]);

interface CliOptions {
  readonly matchups: number;
  readonly matches: number;
  readonly strategy: string;
  readonly seedBase: string;
  readonly maxActions: number;
  readonly verbose: boolean;
  /** Print one rendered example per exercised key (owner view) after the sweep. */
  readonly dump: boolean;
}

function parseArgs(argv: readonly string[]): CliOptions {
  const options: { -readonly [K in keyof CliOptions]: CliOptions[K] } = {
    matchups: 4,
    matches: 3,
    strategy: "hero-profile",
    seedBase: "log-audit",
    maxActions: 400,
    verbose: false,
    dump: false,
  };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]!;
    const next = (): string => {
      const value = argv[index + 1];
      if (value === undefined) throw new Error(`Missing value for ${arg}`);
      index += 1;
      return value;
    };
    switch (arg) {
      case "--matchups":
        options.matchups = Number.parseInt(next(), 10);
        break;
      case "--matches":
        options.matches = Number.parseInt(next(), 10);
        break;
      case "--strategy":
        options.strategy = next();
        break;
      case "--seed-base":
        options.seedBase = next();
        break;
      case "--max-actions":
        options.maxActions = Number.parseInt(next(), 10);
        break;
      case "--verbose":
        options.verbose = true;
        break;
      case "--dump":
        options.dump = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface MatchRun {
  readonly label: string;
  readonly seed: string;
  readonly logs: readonly FabMoveLog[];
  readonly seats: readonly [string, string];
  readonly turns: number;
  readonly actions: number;
  readonly termination: string;
}

type MatchRuntime = ReturnType<typeof createFabPracticeMatch>["runtime"];

/** Mirrors the bench actor selection: decision seat, then priority, then active. */
function nextActorWithLegalCommands(
  runtime: MatchRuntime,
  player1Id: string,
  player2Id: string,
): { readonly actorId: string; readonly legal: readonly FabLegalCommand[] } | null {
  const state = runtime.getState();
  const ordered = [
    state.decision?.actorId,
    runtime.getPriorityPlayerId(),
    runtime.getActivePlayerId(),
    player1Id,
    player2Id,
  ];
  const seen = new Set<string>();
  for (const actorId of ordered) {
    if (!actorId || seen.has(actorId)) continue;
    seen.add(actorId);
    const legal = listLegalCommands(runtime, actorId);
    if (legal.length > 0) return { actorId, legal };
  }
  return null;
}

function runMatch(input: {
  readonly label: string;
  readonly seed: string;
  readonly player1DeckId: string;
  readonly player2DeckId: string;
  readonly strategyId: string;
  readonly maxActions: number;
}): MatchRun {
  const match = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
    seed: input.seed,
    player1DeckId: input.player1DeckId,
    player2DeckId: input.player2DeckId,
  });
  const { runtime, player1Id, player2Id } = match;
  const strategy = getSafeFabAutomatedActionStrategyOption(input.strategyId).strategy;
  const random = mulberry32(hashSeed(input.seed));
  const logs: FabMoveLog[] = [];
  let actions = 0;
  let termination = "max-actions";

  for (; actions < input.maxActions; actions++) {
    if (runtime.hasGameEnded()) {
      termination = runtime.getGameEndResult()?.reason === "concede" ? "concede" : "life";
      break;
    }
    const next = nextActorWithLegalCommands(runtime, player1Id, player2Id);
    const actorId =
      next?.actorId ??
      runtime.getState().decision?.actorId ??
      runtime.getPriorityPlayerId() ??
      runtime.getActivePlayerId();
    if (!actorId) {
      termination = "stall";
      break;
    }
    if (!next && seatMustAct(runtime, actorId)) {
      const lastResort = concedeCommand(runtime, actorId);
      logs.push(...submitAutomatedAction(runtime, actorId, lastResort, [lastResort]).moveLogs);
      termination = "concede";
      break;
    }
    const chosen =
      chooseAutomatedAction(runtime, actorId, strategy, { random }) ??
      next?.legal[0] ??
      (seatMustAct(runtime, actorId) ? concedeCommand(runtime, actorId) : null);
    if (!chosen) {
      termination = "stall";
      break;
    }
    const legal = next?.legal ?? listLegalCommands(runtime, actorId, { includeConcede: true });
    const submitted = submitAutomatedAction(runtime, actorId, chosen, legal);
    logs.push(...submitted.moveLogs);
    if (submitted.conceded) {
      termination = "concede";
      break;
    }
    if (!submitted.advanced) {
      termination = "illegal";
      break;
    }
  }
  if (runtime.hasGameEnded() && termination === "max-actions") {
    termination = runtime.getGameEndResult()?.reason === "concede" ? "concede" : "life";
  }

  return {
    label: input.label,
    seed: input.seed,
    logs,
    seats: [player1Id, player2Id],
    turns: runtime.getState().turnNumber,
    actions,
    termination,
  };
}

function wireMessagesOf(log: FabMoveLog): readonly FabMoveLogMessage[] {
  return [...log.public, ...Object.values(log.privateByPlayerId ?? {}).flat()];
}

/** First-occurrence rendered sample per key, owner view (seat[0] = "You"). */
function collectExamples(
  run: MatchRun,
  examples: Map<string, string>,
  label: FabLogActorLabel,
): void {
  for (const log of run.logs) {
    const privateKeys = new Set<string>();
    for (const appendix of Object.values(log.privateByPlayerId ?? {})) {
      for (const message of appendix) privateKeys.add(message.key);
    }
    for (const message of wireMessagesOf(log)) {
      if (examples.has(message.key)) continue;
      const suffix = privateKeys.has(message.key) ? "  [private]" : "";
      examples.set(message.key, `${renderFabMoveLogMessage(message, label)}${suffix}`);
    }
  }
}

function cardNamesFromValues(values: FabMoveLogMessage["values"]): readonly string[] {
  if (!values) return [];
  const names: string[] = [];
  for (const key of CARD_NAME_VALUE_KEYS) {
    const value = values[key];
    if (typeof value !== "string" || value.length === 0) continue;
    for (const part of value.split(",")) {
      const name = part.trim();
      if (name.length > 0 && !NON_NAME_PLACEHOLDERS.has(name)) names.push(name);
    }
  }
  return names;
}

const EXPECTED_TAGS_BY_CATEGORY: Readonly<Record<string, readonly string[]>> = {
  action: ["move"],
  combat: ["combat"],
  ability: ["ability"],
  rules: ["system"],
  system: ["system"],
};

type ProjectedEntry = ReturnType<typeof projectFabLogEntries>[number];

interface MatchAudit {
  readonly violations: readonly string[];
  readonly exercisedKeys: ReadonlySet<string>;
  readonly messageCount: number;
}

// Viewer id for the public-reader surface: not a seat, so both players label
// as "Opponent" and no private appendix can ever merge — the shape a true
// spectator (or a server log endpoint) would consume.
const PUBLIC_READER_ID = "public-reader";

function auditMatch(run: MatchRun): MatchAudit {
  const violations: string[] = [];
  const where = `${run.label} seed=${run.seed}`;
  const [seatA, seatB] = run.seats;
  const exercisedKeys = new Set<string>();
  let messageCount = 0;

  // 1. Wire shape: registry membership, self-describing parity, appendix scoping.
  const publicNames = new Set<string>();
  const secretNamesBySeat = new Map<string, Set<string>>();
  for (const log of run.logs) {
    for (const message of log.public) {
      for (const name of cardNamesFromValues(message.values)) publicNames.add(name);
    }
    for (const [seat, appendix] of Object.entries(log.privateByPlayerId ?? {})) {
      const secrets = secretNamesBySeat.get(seat) ?? new Set<string>();
      for (const message of appendix) {
        for (const name of cardNamesFromValues(message.values)) secrets.add(name);
      }
      secretNamesBySeat.set(seat, secrets);
    }
  }

  for (const [logIndex, log] of run.logs.entries()) {
    const logWhere = `${where} log#${logIndex} (${log.moveType})`;
    for (const [seat, appendix] of Object.entries(log.privateByPlayerId ?? {})) {
      if (!run.seats.includes(seat)) {
        violations.push(`${logWhere}: appendix targets unknown seat "${seat}"`);
      }
    }
    for (const [messageIndex, message] of wireMessagesOf(log).entries()) {
      messageCount += 1;
      const messageWhere = `${logWhere} msg#${messageIndex} key=${message.key}`;
      if (!FAB_LOG_KEYS.includes(message.key as FabLogKey)) {
        violations.push(`${messageWhere}: key missing from registry`);
        continue;
      }
      exercisedKeys.add(message.key);
      const rendered = renderFabLogTemplate(message.key as FabLogKey, message.values ?? {});
      if (rendered !== message.defaultMessage) {
        violations.push(`${messageWhere}: defaultMessage diverges from catalog render`);
      }
      if (message.defaultMessage.includes("{") || message.defaultMessage.includes("}")) {
        violations.push(`${messageWhere}: unrendered placeholder in defaultMessage`);
      }
    }
    for (const [messageIndex, message] of log.public.entries()) {
      if (PRIVATE_FAMILY_KEYS.has(message.key)) {
        violations.push(`${logWhere} public#${messageIndex}: private-family key in public array`);
      }
    }
  }

  // 2. Projections: owner per seat, plus the spectator-shaped public-only view.
  const ownerEntries = new Map<string, readonly ProjectedEntry[]>();
  for (const seat of run.seats) {
    const entries = projectFabLogEntries(run.logs, {
      viewerId: seat,
      actorLabel: ownerViewLabel(seat, run.seats),
    });
    ownerEntries.set(seat, entries);
  }
  auditProjections(
    projectFabLogEntries(run.logs, { viewerId: PUBLIC_READER_ID, includePrivate: false }),
    `${where} spectator`,
    violations,
  );
  for (const [seat, entries] of ownerEntries) {
    auditProjections(entries, `${where} owner(${seat})`, violations);
  }

  // 3. Cross-seat leak audit: names that only ever appeared in a seat's private
  //    appendix must be absent from every other view of the same history.
  for (const [seat, secrets] of secretNamesBySeat) {
    const genuinelySecret = [...secrets].filter((name) => !publicNames.has(name));
    if (genuinelySecret.length === 0) continue;
    const other = seat === seatA ? seatB : seatA;
    const readerJson = JSON.stringify(ownerEntries.get(other) ?? []);
    const spectatorJson = JSON.stringify(
      projectFabLogEntries(run.logs, { viewerId: PUBLIC_READER_ID, includePrivate: false }),
    );
    for (const name of genuinelySecret) {
      if (readerJson.includes(name)) {
        violations.push(`${where}: secret "${name}" (${seat} appendix) visible to reader ${other}`);
      }
      if (spectatorJson.includes(name)) {
        violations.push(`${where}: secret "${name}" (${seat} appendix) visible to a spectator`);
      }
    }
    const ownerJson = JSON.stringify(ownerEntries.get(seat) ?? []);
    for (const name of genuinelySecret) {
      if (!ownerJson.includes(name)) {
        violations.push(`${where}: secret "${name}" missing from its owner's own view`);
      }
    }
  }

  return { violations, exercisedKeys, messageCount };
}

function auditProjections(
  entries: readonly ProjectedEntry[],
  where: string,
  violations: string[],
): void {
  for (const [index, entry] of entries.entries()) {
    const entryWhere = `${where} entry#${index}`;
    if (entry.message.trim().length === 0) {
      violations.push(`${entryWhere}: empty rendered message`);
    }
    if (entry.message.includes("{") || entry.message.includes("}")) {
      violations.push(`${entryWhere}: unrendered placeholder "${entry.message}"`);
    }
    if (/\bplayer-\d+\b/.test(entry.message)) {
      violations.push(`${entryWhere}: raw seat id leaked "${entry.message}"`);
    }
    if (entry.message.includes("REGISTRY-MISS")) {
      violations.push(`${entryWhere}: registry-miss fallback "${entry.message}"`);
    }
    // Card references are extracted from values before rendering; a template
    // that prints its values must keep the name in the rendered text. Catches
    // value corruption (e.g. an actor-labeler that rewrites non-seat strings).
    for (const ref of entry.cardRefs ?? []) {
      if (!entry.message.includes(ref.name)) {
        violations.push(`${entryWhere}: card name "${ref.name}" dropped from "${entry.message}"`);
      }
    }
  }
}

function buildMatchups(count: number): readonly (readonly [string, string])[] {
  const tournament = listFabDecks().filter((deck) => isFabTournamentDeck(deck));
  const ids = tournament.map((deck) => deck.id);
  if (ids.length < 2) {
    return [[DEFAULT_PLAYER_DECK_ID, DEFAULT_BOT_DECK_ID]];
  }
  const matchups: (readonly [string, string])[] = [[DEFAULT_PLAYER_DECK_ID, DEFAULT_BOT_DECK_ID]];
  for (let index = 0; matchups.length < count; index++) {
    const first = ids[index % ids.length]!;
    const second = ids[(index + 1) % ids.length]!;
    matchups.push([first, second]);
  }
  return matchups.slice(0, count);
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const matchups = buildMatchups(options.matchups);

  console.log("FaB dual-viewer log audit (headless bot lab)");
  console.log(
    `  strategy=${options.strategy} matchups=${matchups.length} matches/matchup=${options.matches} maxActions=${options.maxActions}`,
  );

  const violations: string[] = [];
  const exercised = new Set<string>();
  const examples = new Map<string, string>();
  let totalLogs = 0;
  let totalMessages = 0;

  for (const [matchupIndex, [player1DeckId, player2DeckId]] of matchups.entries()) {
    for (let matchIndex = 0; matchIndex < options.matches; matchIndex++) {
      const seed = `${options.seedBase}-${matchupIndex}-${matchIndex}`;
      const label = `m${matchupIndex + 1} ${player1DeckId} vs ${player2DeckId}`;
      const run = runMatch({
        label,
        seed,
        player1DeckId,
        player2DeckId,
        strategyId: options.strategy,
        maxActions: options.maxActions,
      });
      const audit = auditMatch(run);
      violations.push(...audit.violations);
      for (const key of audit.exercisedKeys) exercised.add(key);
      if (options.dump) {
        collectExamples(run, examples, ownerViewLabel(run.seats[0]!, run.seats));
      }
      totalLogs += run.logs.length;
      totalMessages += audit.messageCount;
      if (options.verbose && matchupIndex === 0 && matchIndex === 0) {
        const seatA = run.seats[0]!;
        const owner = projectFabLogEntries(run.logs, { viewerId: seatA });
        const spectator = projectFabLogEntries(run.logs, {
          viewerId: PUBLIC_READER_ID,
          includePrivate: false,
        });
        const pick = (entries: readonly ProjectedEntry[]): readonly ProjectedEntry[] => [
          ...entries.filter((entry) => (entry.cardRefs ?? []).length > 0).slice(0, 4),
          entries[entries.length - 1]!,
        ];
        console.log("  sample owner lines:");
        for (const entry of pick(owner)) console.log(`    - ${entry.message}`);
        console.log("  sample spectator lines:");
        for (const entry of pick(spectator)) console.log(`    - ${entry.message}`);
      }
      console.log(
        `  ${label} seed=${seed}: turns=${run.turns} actions=${run.actions} ` +
          `moveLogs=${run.logs.length} messages=${audit.messageCount} end=${run.termination}`,
      );
    }
  }

  const missing = FAB_LOG_KEYS.filter((key) => !exercised.has(key));
  const coverage = `${exercised.size}/${FAB_LOG_KEYS.length}`;
  console.log("");
  console.log(`  corpus: ${totalLogs} move logs, ${totalMessages} wire messages`);
  console.log(`  registry coverage: ${coverage} keys exercised by the bot corpus`);
  if (missing.length > 0) {
    console.log(`  not exercised (${missing.length}): ${missing.join(", ")}`);
  }

  console.log("");
  if (options.dump && examples.size > 0) {
    console.log(`vocabulary samples (${examples.size} keys, owner view, seat[0] = "You"):`);
    for (const key of FAB_LOG_KEYS) {
      const sample = examples.get(key);
      if (sample === undefined) continue;
      console.log(
        `  [${FAB_LOG_KEY_CATEGORIES[key]}] ${key.replace("flesh-and-blood.", "")}: ${sample}`,
      );
    }
    console.log("");
  }
  if (violations.length > 0) {
    console.log(`  violations: ${violations.length}`);
    for (const violation of violations.slice(0, 40)) console.log(`    - ${violation}`);
    if (violations.length > 40) console.log(`    … and ${violations.length - 40} more`);
  } else {
    console.log("  violations: 0");
  }
  const verdict = violations.length === 0 ? "PASS" : "FAIL";
  console.log(`RESULT: ${verdict}`);
  process.exitCode = violations.length === 0 ? 0 : 1;
}

main();
