import {
  opponentOf,
  type MatchState,
  type PlayerId,
} from "../../../../../../../../../alpha-clash/packages/engine/src/types.ts";

/** Full private simulation state. Definitions are immutable, but token creation adds entries. */
export function forkAlphaClashState(state: MatchState): MatchState {
  return {
    ...structuredClone({ ...state, definitions: {}, moveLog: [] }),
    definitions: { ...state.definitions },
  };
}

/** Native priority, including setup, responses, and the split before-damage step. */
export function alphaClashSearchActor(state: MatchState): PlayerId | undefined {
  if (state.phase.name === "complete") return undefined;
  if (state.phase.name === "setup") {
    const order = [state.activePlayer, opponentOf(state.activePlayer)];
    if (state.mulligansResolved) return state.activePlayer;
    return (
      order.find((id) => state.mulliganDeclarations[id] === undefined) ??
      order.find(
        (id) => state.mulliganDeclarations[id] && state.mulliganSelections[id] === undefined,
      )
    );
  }
  if (state.pendingChoices[0]) return state.pendingChoices[0].playerId;
  if (state.responseWindow) return state.responseWindow.openFor;
  const clash = state.clash;
  if (!clash) return state.activePlayer;
  const attacker = state.cards[clash.attackerId]?.controller ?? state.activePlayer;
  if (["counter", "obstruct", "defenderBuff"].includes(clash.step)) return opponentOf(attacker);
  if (clash.step === "beforeDamage" && clash.attackerPassedBeforeDamage)
    return opponentOf(attacker);
  return attacker;
}

/** Exclude bookkeeping; retain private cards, deck order, RNG, costs and pending effects. */
export function alphaClashSearchKey(state: MatchState): string {
  const ids = new Map<string, string>();
  const definitions = Object.fromEntries(
    [...new Set(Object.values(state.cards).map((card) => card.definitionId))]
      .filter((id) => id.startsWith("token"))
      .map((id) => [id, state.definitions[id]]),
  );
  return JSON.stringify(
    {
      ...state,
      definitions,
      moveLog: undefined,
      stateID: undefined,
      nextLogNumber: undefined,
      nextChoiceNumber: undefined,
      nextStandbyNumber: undefined,
    },
    (_key, value: unknown) => {
      if (typeof value !== "string" || !/^(choice|standby|trigger|enter-order)-\d+$/.test(value))
        return value;
      if (!ids.has(value)) ids.set(value, `pending-${ids.size}`);
      return ids.get(value);
    },
  );
}
