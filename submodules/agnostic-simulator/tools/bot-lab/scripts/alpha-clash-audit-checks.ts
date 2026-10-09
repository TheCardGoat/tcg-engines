import type {
  AcCommand,
  MatchState,
  MoveLogEntry,
  PlayerId,
} from "../../../../alpha-clash/packages/engine/src/index.ts";

/** Bounded, independent checks for the two recorded main-deck games.
 * No engine cost, damage, stat, or legality evaluator is called here.
 * This does not cover all cards, keywords, or the general Standby protocol.
 */
export function createAlphaClashRulesAudit() {
  const failures: string[] = [];
  const counts: Record<string, number> = {};
  let previous: MatchState | undefined;
  let logCount = 0;
  const check = (rule: string, valid: boolean, detail: string) => {
    counts[rule] = (counts[rule] ?? 0) + 1;
    if (!valid) failures.push(`${rule}: ${detail}`);
  };
  const printedStats = (state: MatchState, id: string) => {
    const card = state.cards[id]!;
    const def = state.definitions[card.definitionId]!;
    let attack = "attack" in def ? def.attack : 0;
    let defense = "defense" in def ? def.defense : 0;
    for (const mod of card.temporaryMods) {
      attack += mod.attack ?? 0;
      defense += mod.defense ?? 0;
    }
    if (def.cardType === "clash") {
      for (const source of Object.values(state.cards)) {
        if (source.faceDown) continue;
        if (
          source.definitionId === "ac-ac1-001" &&
          source.zone === "clashground" &&
          ["alpha-hunter", "rogue"].includes(def.affiliation ?? "")
        )
          attack += 1;
        if (
          source.definitionId === "ac-ac3-010" &&
          source.zone === "clash" &&
          source.controller === card.controller &&
          source.instanceId !== id &&
          def.affiliation === "discarded"
        ) {
          attack += 1;
          defense += 1;
        }
      }
    }
    return { attack: Math.max(0, attack), defense: defense - card.clashDamage - card.phaseDamage };
  };
  const canAssignColors = (
    state: MatchState,
    resources: readonly string[],
    pips: Readonly<Record<string, number>>,
  ) => {
    const colors = Object.entries(pips).flatMap(([color, count]) =>
      Array<string>(count).fill(color),
    );
    const assign = (index: number, available: readonly string[]): boolean => {
      const color = colors[index];
      if (!color) return true;
      return available.some(
        (id, i) =>
          state.definitions[state.cards[id]!.definitionId]!.colors.some((c) => c === color) &&
          assign(
            index + 1,
            available.filter((_, j) => i !== j),
          ),
      );
    };
    return assign(0, resources);
  };
  function observe(state: MatchState, command?: AcCommand) {
    const logs: MoveLogEntry[] = state.moveLog.slice(logCount);
    logCount = state.moveLog.length;
    if (previous && command) {
      const before = previous;
      const at = `turn ${before.turnNumber}, command ${command.type}`;
      const paid = (player: PlayerId) =>
        Object.values(before.cards)
          .filter(
            (card) =>
              card.controller === player &&
              card.zone === "resource" &&
              card.ready &&
              !state.cards[card.instanceId]?.ready,
          )
          .map((card) => card.instanceId);
      if (command.type === "playCard") {
        const card = before.cards[command.cardId]!;
        const def = before.definitions[card.definitionId]!;
        if ("cost" in def && card.zone === "hand") {
          const resources = paid(command.playerId);
          check(
            "115.3b resource payment",
            resources.length === def.cost.total &&
              canAssignColors(before, resources, def.cost.pips ?? {}),
            `${at}: ${def.name}`,
          );
        }
      }
      if (command.type === "setCard") {
        check(
          "304.3 free setting",
          paid(command.playerId).length === 0 &&
            state.cards[command.cardId]?.zone === "accessory" &&
            state.cards[command.cardId]?.faceDown === true,
          `${at}: ${command.cardId}`,
        );
      }
      const damage = logs.filter(
        (log) => log.type === "effect.damage" && log.message.includes(" clash damage"),
      );
      if (before.clash && damage.length) {
        const clash = before.clash;
        const opponents = clash.obstructors.length ? clash.obstructors : [clash.targetId];
        const pairs = [
          ...opponents.map((target) => [clash.attackerId, target] as const),
          ...opponents.map((source) => [source, clash.attackerId] as const),
        ];
        const expectedLoss: Record<PlayerId, number> = { "player-one": 0, "player-two": 0 };
        const expectedLogs: string[] = [];
        for (const [source, target] of pairs) {
          const amount = printedStats(before, source).attack;
          if (amount <= 0) continue;
          const targetCard = before.cards[target]!;
          const targetDef = before.definitions[targetCard.definitionId]!;
          expectedLogs.push(`${targetDef.name}|${amount}`);
          if (targetDef.cardType === "contender")
            expectedLoss[targetCard.controller] += Math.max(
              0,
              amount - Math.max(0, printedStats(before, target).defense),
            );
        }
        const actualLogs = damage.map((log) => {
          const take = /^(.*?) takes (\d+) clash damage/.exec(log.message);
          const absorb = /^(.*?) absorbs (\d+) clash damage/.exec(log.message);
          const match = take ?? absorb;
          return match ? `${match[1]}|${match[2]}` : log.message;
        });
        check(
          "504.2g simultaneous damage",
          JSON.stringify(actualLogs.sort()) === JSON.stringify(expectedLogs.sort()),
          `${at}: expected ${expectedLogs.join(", ")}, got ${actualLogs.join(", ")}`,
        );
        for (const player of ["player-one", "player-two"] as const)
          check(
            "117.2b Contender damage",
            state.players[player].health === before.players[player].health - expectedLoss[player],
            `${at}: ${player}`,
          );
        const challengeEligible = (player: PlayerId) => {
          const id = before.players[player].contenderId;
          const definitionId = before.cards[id]!.definitionId;
          if (definitionId === "ac-ac7-001") return state.players[player].health <= 25;
          if (definitionId !== "ac-vtd1-001-p-black" || state.players[player].health > 15)
            return false;
          return Object.values(before.cards).some((card) => {
            const def = before.definitions[card.definitionId]!;
            return (
              card.controller === player &&
              card.zone === "oblivion" &&
              def.cardType === "clash" &&
              def.cost.total <= 3 &&
              !def.keywords?.includes("unrivaled")
            );
          });
        };
        if (
          before.clash.obstructors.length === 0 &&
          before.definitions[before.cards[before.clash.attackerId]!.definitionId]!.cardType ===
            "contender" &&
          challengeEligible("player-one") &&
          challengeEligible("player-two") &&
          state.phase.name !== "complete"
        )
          check(
            "603.3b/409.5 simultaneous Challenges",
            state.pendingChoices[0]?.playerId !== before.activePlayer,
            `${at}: the non-active player's top effect must resolve first`,
          );
      }
      if (command.type === "resolveChoice") {
        const choice = before.pendingChoices[0];
        if (
          choice?.kind === "modal" &&
          choice.prompt === "Choose what happens to the revealed card"
        ) {
          const top = before.deckOrder[choice.playerId][0];
          check(
            "Clarity reveal to hand",
            command.optionId !== "0" || state.cards[top!]?.zone === "hand",
            at,
          );
        }
        if (
          choice?.kind === "count" &&
          choice.sourceId &&
          before.cards[choice.sourceId]?.definitionId === "ac-ac6-033"
        ) {
          const count = Number(command.optionId);
          const oldTop = before.deckOrder[choice.playerId].slice(0, count);
          check(
            "Bombardment diminish",
            count >= 0 &&
              count <= 3 &&
              oldTop.every((id) => state.cards[id]?.zone === "oblivion") &&
              state.deckOrder[choice.playerId].length ===
                before.deckOrder[choice.playerId].length - count,
            at,
          );
          check(
            "Bombardment damage",
            count === 0 ||
              logs.filter(
                (log) =>
                  log.type === "effect.damage" &&
                  log.message.includes(`takes ${count} non-clash damage`),
              ).length === 1,
            at,
          );
        }
      }
      for (const choice of state.pendingChoices) {
        if (
          choice.prompt.includes("Trigger - Challenge") ||
          (state.pendingDefeats.some((defeat) => defeat.cardId === choice.sourceId) && before.clash)
        )
          check(
            "504.2g Damage-Step choices",
            state.phase.name === "clash" && state.clash?.step === "damage",
            `${at}: ${choice.prompt}`,
          );
      }
      for (const defeat of state.pendingDefeats)
        check(
          "504.2g Defeat before zone move",
          state.cards[defeat.cardId]?.zone === "clash",
          `${at}: ${defeat.cardId}`,
        );
      if (state.phase.name === "complete")
        check(
          "104 terminal log",
          state.moveLog.filter((log) => log.type === "framework.gameOver").length === 1,
          at,
        );
    }
    previous = {
      ...structuredClone({ ...state, definitions: {}, moveLog: [] }),
      definitions: state.definitions,
    };
  }
  return { observe, result: () => ({ checks: counts, failures }) };
}
