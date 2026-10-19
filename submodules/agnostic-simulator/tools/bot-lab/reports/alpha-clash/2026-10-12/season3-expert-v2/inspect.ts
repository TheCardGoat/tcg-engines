import "../unpack-evaluation-data.ts";
import "./unpack-traces.ts";
import { readFileSync, writeFileSync } from "node:fs";
import {
  applyCommand,
  type MatchState,
} from "../../../../../../../alpha-clash/packages/engine/src/index.ts";
import {
  createAlphaClashExpert,
  inspection,
} from "./investigation/source-v1/expert-oracle.inspect.ts";
const game = Number(process.argv[2]),
  index = Number(process.argv[3]);
const data = JSON.parse(
  readFileSync(new URL(`investigation/v1-mirror-${game}.json`, import.meta.url), "utf8"),
);
let state: MatchState = data.initial;
for (const row of data.rows.slice(1, index)) {
  const r = applyCommand(state, row.command);
  if (!r.success) throw Error(JSON.stringify(r));
  state = r.state;
}
const seat = data.record.candidateSeat === "p1" ? "player-one" : "player-two";
const describe = (value: unknown): unknown => {
  if (typeof value === "string" && state.cards[value])
    return value + ":" + state.definitions[state.cards[value].definitionId].name;
  if (Array.isArray(value)) return value.map(describe);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, describe(v)]));
  return value;
};
function summary(s: MatchState) {
  return {
    phase: s.phase,
    turn: s.turnNumber,
    clash: s.clash,
    pending: s.pendingChoices.length,
    response: s.responseWindow,
    health: Object.values(s.players).map((p) => p.health),
    board: Object.values(s.cards)
      .filter((c) => c.zone === "clash")
      .map((c) => ({
        name: s.definitions[c.definitionId].name,
        seat: c.controller,
        ready: c.ready,
      })),
  };
}
const result = createAlphaClashExpert({ maxNodes: Number(process.argv[4]) || 768 }).decide(
  state,
  seat,
);
console.log(JSON.stringify(describe(result), null, 2));
writeFileSync(
  new URL(`investigation/inspect-${game}-${index}.json`, import.meta.url),
  JSON.stringify(
    inspection,
    (key, value) =>
      key === "state" ? summary(value) : key === "seen" ? undefined : describe(value),
    2,
  ),
);
