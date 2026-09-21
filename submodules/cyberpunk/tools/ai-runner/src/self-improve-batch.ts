import { join } from "node:path";
import type { CoachMatchDump } from "@tcg/cyberpunk-engine";
import { authoredBotLabDeckSpecs } from "./authored-decks.ts";
import {
  playCoachMatch,
  readCoachDump,
  writeCoachDump,
  type CoachPlayOptions,
} from "./coach-play.ts";
import {
  appendJournalJsonl,
  CLOSED_FLOW_GAPS,
  coachWalkDump,
  isDeckBlocked,
  lastJournalRowForDeck,
  readJournalJsonl,
  writeJournalMarkdown,
  type SelfImproveJournalRow,
} from "./self-improve-journal.ts";

export interface SelfImproveBatchOptions {
  iterations: number;
  seedBase: string;
  dumpDir: string;
  journalJsonl: string;
  journalMarkdown: string;
  strategyA?: string;
  strategyB?: string;
  maxSteps?: number;
  deckIds?: readonly string[];
  closedFlowGaps?: ReadonlySet<string>;
  playMatch?: (opts: CoachPlayOptions) => CoachMatchDump;
}

export function runSelfImproveBatch(opts: SelfImproveBatchOptions): SelfImproveJournalRow[] {
  const strategyA = opts.strategyA ?? "tactical";
  const strategyB = opts.strategyB ?? "tactical";
  const closed = opts.closedFlowGaps ?? CLOSED_FLOW_GAPS;
  const play = opts.playMatch ?? playCoachMatch;
  const specs = opts.deckIds
    ? authoredBotLabDeckSpecs.filter((spec) => opts.deckIds!.includes(spec.id))
    : authoredBotLabDeckSpecs;
  const rows = readJournalJsonl(opts.journalJsonl);

  for (const spec of specs) {
    let prior = lastJournalRowForDeck(rows, spec.id);
    if (prior && isDeckBlocked(prior, closed)) {
      continue;
    }
    const startIter = (prior?.iteration ?? 0) + 1;
    for (let iteration = startIter; iteration <= opts.iterations; iteration++) {
      prior = lastJournalRowForDeck(rows, spec.id);
      if (prior && isDeckBlocked(prior, closed)) {
        break;
      }
      if (prior) readCoachDump(prior.dumpPath);

      const seed = `${opts.seedBase}/${spec.id}/${iteration}`;
      const dumpPath = join(opts.dumpDir, spec.id, `iter-${iteration}.json`);
      const dump = play({
        strategyA,
        strategyB,
        seed,
        deckSource: "authored-botlab",
        deckAId: spec.id,
        maxSteps: opts.maxSteps ?? 1500,
      });
      writeCoachDump(dumpPath, dump);
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
      appendJournalJsonl(opts.journalJsonl, row);
      rows.push(row);
      if (isDeckBlocked(row, closed)) break;
    }
  }
  writeJournalMarkdown(opts.journalMarkdown, rows);
  return rows;
}
