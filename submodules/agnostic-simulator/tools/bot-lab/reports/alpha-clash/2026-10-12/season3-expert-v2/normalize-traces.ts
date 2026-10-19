import "../unpack-evaluation-data.ts";
import "./unpack-traces.ts";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { stableBotHash } from "@tcg/bot-core";
import {
  applyCommand,
  type MatchState,
} from "../../../../../../../alpha-clash/packages/engine/src/index.ts";
import {
  effectiveAttack,
  effectiveDefense,
} from "../../../../../../../alpha-clash/packages/engine/src/state.ts";
const folder = new URL("investigation/", import.meta.url);
let verified = 0;
for (const name of readdirSync(folder).filter((n) =>
  /^(v1|development-[12])-mirror-\d+\.json$/.test(n),
)) {
  const file = new URL(name, folder);
  const data = JSON.parse(readFileSync(file, "utf8"));
  let state: MatchState = structuredClone(data.initial);
  let lastLog = 0;
  for (const row of data.rows) {
    if (row.command) {
      const r = applyCommand(state, row.command);
      if (!r.success) throw Error(`${name} command ${row.index}`);
      state = r.state;
    }
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
    Object.assign(
      row,
      structuredClone({
        turn: state.turnNumber,
        active: state.activePlayer,
        phase: state.phase,
        clash: state.clash,
        window: state.responseWindow,
        choices: state.pendingChoices,
        portal: state.portalOpen,
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
  }
  const ids = new Set(Object.values(state.cards).map((c) => c.definitionId));
  const definitions = Object.fromEntries([...ids].sort().map((id) => [id, state.definitions[id]]));
  const hash = stableBotHash({ ...state, definitions, moveLog: [], nextLogNumber: 0 });
  if (hash !== data.record.finalStateHash) throw Error(`${name} final hash differs`);
  data.traceVerification = {
    commands: data.rows.length - 1,
    finalStateHash: hash,
    isolatedSnapshots: true,
  };
  writeFileSync(file, JSON.stringify(data));
  verified++;
}
console.log(`Verified and isolated ${verified} native command traces`);
