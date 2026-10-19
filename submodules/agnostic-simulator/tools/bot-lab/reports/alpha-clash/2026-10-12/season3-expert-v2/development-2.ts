import "../unpack-evaluation-data.ts";
import "./unpack-traces.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runAlphaClashPracticeMatch } from "../../../../src/adapters/alpha-clash/runner.ts";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";
import { resolveAlphaClashLabDeck } from "@tcg/alpha-clash-server-adapter/practice";
import {
  effectiveAttack,
  effectiveDefense,
} from "../../../../../../../alpha-clash/packages/engine/src/state.ts";
import { evaluateAlphaClash } from "../../../../../../../alpha-clash/packages/engine/src/automation/evaluate.ts";
import { botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
const file = (n: string) => new URL(n, import.meta.url);
const report = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("../season3-expert/report.json"), "utf8")),
);
const revision = adapter.getEngineRevision();
const matches = report.matches.filter(
  (m) =>
    m.candidateDeckId === m.baselineDeckId &&
    ["season3-xiii-war", "season3-sloppy-valen"].includes(m.candidateDeckId),
);
if (process.argv[2] === undefined) {
  await Promise.all(
    matches.map(
      (_, index) =>
        new Promise<void>((resolve, reject) => {
          const child = spawn(process.execPath, [fileURLToPath(import.meta.url), String(index)], {
            stdio: "inherit",
          });
          child.on("error", reject);
          child.on("exit", (c) => (c === 0 ? resolve() : reject(Error(`trace ${index}: ${c}`))));
        }),
    ),
  );
} else {
  const index = Number(process.argv[2]);
  const record = matches[index];
  const rows: unknown[] = [];
  let initial: unknown;
  let lastLog = 0;
  const candidate = record.candidateSeat === "p1" ? "player-one" : "player-two";
  const replay = runAlphaClashPracticeMatch({
    ...record,
    shuffleSeed: record.seed.replace(/-seat-[12]$/, ""),
    candidateStrategyId: "expert-oracle",
    baselineStrategyId: "meta-v1",
    candidateDeck: resolveAlphaClashLabDeck(record.candidateDeckId),
    baselineDeck: resolveAlphaClashLabDeck(record.baselineDeckId),
    observe(state, command) {
      if (!command) initial = structuredClone(state);
      const describe = (id: string) => {
        const c = state.cards[id];
        const d = state.definitions[c.definitionId];
        return {
          id,
          name: d.name,
          zone: c.zone,
          ready: c.ready,
          faceDown: c.faceDown,
          attachedTo: c.attachedTo,
          attack: effectiveAttack(state, id),
          defense: effectiveDefense(state, id),
        };
      };
      rows.push(
        structuredClone({
          index: rows.length,
          command,
          turn: state.turnNumber,
          active: state.activePlayer,
          phase: state.phase,
          clash: state.clash,
          window: state.responseWindow,
          choices: state.pendingChoices,
          portal: state.portalOpen,
          score: evaluateAlphaClash(state, candidate),
          players: Object.fromEntries(
            Object.entries(state.players).map(([id, p]) => [
              id,
              {
                health: p.health,
                resources: Object.values(state.cards)
                  .filter((c) => c.controller === id && c.zone === "resource")
                  .map((c) => describe(c.instanceId)),
                hand: Object.values(state.cards)
                  .filter((c) => c.controller === id && c.zone === "hand")
                  .map((c) => describe(c.instanceId)),
                board: Object.values(state.cards)
                  .filter(
                    (c) =>
                      c.controller === id &&
                      ["clash", "contender", "accessory", "clashground"].includes(c.zone),
                  )
                  .map((c) => describe(c.instanceId)),
              },
            ]),
          ),
          logs: state.moveLog.slice(lastLog),
        }),
      );
      lastLog = state.moveLog.length;
    },
  });

  writeFileSync(
    file(`investigation/development-2-mirror-${index}.json`),
    JSON.stringify({ record: replay, oldRecord: record, revision, initial, rows }),
  );
  console.log(
    `development ${index}: ${record.candidateDeckId}, ${record.winner} -> ${replay.winner}, ${replay.termination}, ${replay.actionCount} commands`,
  );
}
