import { canPayCost } from "../../../../../../../../../alpha-clash/packages/engine/src/resources.ts";
import {
  effectiveAttack,
  effectiveDefense,
  effectiveKeywords,
} from "../../../../../../../../../alpha-clash/packages/engine/src/state.ts";
import {
  opponentOf,
  type MatchState,
  type PlayerId,
  type RuntimeCard,
} from "../../../../../../../../../alpha-clash/packages/engine/src/types.ts";

export const ALPHA_CLASH_TERMINAL_SCORE = 1_000_000;

export function alphaClashCardValue(state: MatchState, card: RuntimeCard): number {
  const def = state.definitions[card.definitionId];
  if (def.cardType === "clash" || def.cardType === "contender")
    return (
      16 +
      Math.max(0, effectiveAttack(state, card.instanceId)) * 5 +
      Math.max(0, effectiveDefense(state, card.instanceId)) * 3
    );
  return 8 + (def.cost?.total ?? 0) * 2 + (def.abilities?.length ?? 0) * 3;
}

/** A positional estimate, not an alternative implementation of combat or card effects. */
export function evaluateAlphaClash(state: MatchState, seat: PlayerId): number {
  if (state.phase.name === "complete")
    return state.phase.winner === seat ? ALPHA_CLASH_TERMINAL_SCORE : -ALPHA_CLASH_TERMINAL_SCORE;
  const cards = Object.values(state.cards);
  const value = (player: PlayerId): number => {
    const own = cards.filter((card) => card.controller === player);
    const health = state.players[player].health;
    const resources = own.filter((card) => card.zone === "resource");
    const hand = own.filter((card) => card.zone === "hand");
    const handValue = (card: RuntimeCard) => {
      const def = state.definitions[card.definitionId];
      return (
        6 +
        Math.min(12, alphaClashCardValue(state, card) * 0.15) +
        ("cost" in def && def.cost && canPayCost(state, player, def.cost) ? 3 : 0)
      );
    };
    let score = health * 12 - Math.max(0, 12 - health) ** 2 * 2;
    score += resources.length * 7 + resources.filter((card) => card.ready).length * 2;
    // A second color can enable a hand even when the resource count is unchanged.
    const colors = new Set(
      resources.flatMap((card) => [...state.definitions[card.definitionId].colors]),
    );
    score += hand.reduce((sum, card) => {
      const def = state.definitions[card.definitionId];
      const missing = Object.keys(("cost" in def ? def.cost?.pips : undefined) ?? {}).filter(
        (color) => ![...colors].some((c) => c === color),
      );
      return sum + handValue(card) - missing.length * 3;
    }, 0);
    for (const card of own) {
      const def = state.definitions[card.definitionId];
      if (card.zone === "clash" && def.cardType === "clash") {
        score += alphaClashCardValue(state, card) + 12;
        const keywords = effectiveKeywords(state, card.instanceId);
        score += keywords.length * 2;
        if (card.ready) score += Math.max(0, effectiveAttack(state, card.instanceId)) * 2 + 4;
      } else if (["accessory", "clashground"].includes(card.zone)) {
        score += alphaClashCardValue(state, card) * (card.faceDown ? 0.6 : 1);
      }
    }
    const contender = state.cards[state.players[player].contenderId];
    if (contender?.ready) score += Math.max(0, effectiveAttack(state, contender.instanceId)) * 2;
    const deck = state.deckOrder[player];
    score += Math.min(10, deck.length) * 2;
    if (deck.length < 3) score -= (3 - deck.length) * 25;
    // Known draw order is intentionally available to this oracle policy.
    score += deck
      .slice(0, 2)
      .reduce((sum, id, index) => sum + handValue(state.cards[id]) / (3 + index), 0);
    const replay = state.definitions[contender.definitionId].abilities?.some(
      (ability) => ability.kind === "static" && ability.allowVoidReplay,
    );
    score += own
      .filter((card) => card.zone === "oblivion")
      .reduce((sum, card) => sum + (replay ? handValue(card) * 0.3 : 0.2), 0);
    return score;
  };
  return value(seat) - value(opponentOf(seat));
}
