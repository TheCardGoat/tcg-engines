import "../unpack-evaluation-data.ts";
import "./unpack-traces.ts";
import { readFileSync } from "node:fs";
import {
  applyCommand,
  createAlphaClashExpert,
  type MatchState,
} from "../../../../../../../alpha-clash/packages/engine/src/index.ts";
for (const [game, index] of [
  [1, 247],
  [6, 41],
  [11, 219],
  [11, 227],
]) {
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
  const result = createAlphaClashExpert().decide(state, seat);
  console.log({ game, index, old: data.rows[index].command, result });
}
