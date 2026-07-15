import {
  consumeDamagePrevention,
  dealsCombatDamageFirst,
  effectiveAttackRestrictions,
  effectiveHp,
  effectiveKeywords,
  effectivePower,
  getDefinition,
  logMove,
  moveCardToZone,
} from "./state.ts";
import type { MatchState, PlayerId, RuntimeCard, RuntimeEvent } from "./types.ts";

export interface CombatResult {
  readonly success: boolean;
  readonly error?: string;
}

interface ResolveAttackOptions {
  readonly ignoreExhausted?: boolean;
  readonly onTrigger?: (event: RuntimeEvent, playerId: PlayerId) => void;
}

function keywordAmount(text: string | null | undefined, keyword: string): number {
  const match = text?.match(new RegExp(`\\b${keyword}\\s+(\\d+)`, "i"));
  return match ? Number.parseInt(match[1], 10) : 1;
}

function keywordAmountForCard(state: MatchState, cardId: string, keyword: string): number {
  const definition = getDefinition(state, cardId);
  return keywordAmount(definition.text, keyword);
}

function dealCombatDamage(
  state: MatchState,
  card: RuntimeCard,
  amount: number,
  playerId: PlayerId,
): number {
  if (amount <= 0) return 0;
  if (consumeDamagePrevention(state, card)) {
    logMove(state, {
      playerId,
      type: "effect.preventDamage",
      message: `${card.instanceId} prevented ${amount} combat damage.`,
      public: true,
    });
    return 0;
  }
  if (card.shield > 0) {
    card.shield -= 1;
    return 0;
  }
  card.damage += amount;
  return amount;
}

function arenaOf(card: { zone: string }): "groundArena" | "spaceArena" | null {
  if (card.zone === "groundArena" || card.zone === "spaceArena") return card.zone;
  return null;
}

function blocksBySentinel(
  state: MatchState,
  attacker: { zone: string; controller: PlayerId },
  defender: { instanceId: string; zone: string },
): boolean {
  const defenderCard = state.cards[defender.instanceId];
  if (defenderCard && effectiveKeywords(state, defenderCard).includes("sentinel")) return false;
  const attackArena = arenaOf(attacker);
  if (!attackArena) return false;
  return Object.values(state.cards).some(
    (card) =>
      card.controller !== attacker.controller &&
      card.zone === attackArena &&
      effectiveKeywords(state, card).includes("sentinel"),
  );
}

function defeatLethalUnits(
  state: MatchState,
  playerId: PlayerId,
  onTrigger?: (event: RuntimeEvent, playerId: PlayerId) => void,
): void {
  for (const card of Object.values(state.cards)) {
    if (
      (card.zone === "groundArena" || card.zone === "spaceArena") &&
      card.damage >= effectiveHp(state, card)
    ) {
      moveCardToZone(state, card.instanceId, "discard");
      onTrigger?.({ type: "defeated", defeatedId: card.instanceId }, playerId);
      logMove(state, {
        playerId,
        type: "framework.defeat",
        message: `${card.instanceId} is defeated by combat damage.`,
        public: true,
      });
    }
  }
}

export function resolveAttack(
  state: MatchState,
  playerId: PlayerId,
  attackerId: string,
  defenderId: string,
  options: ResolveAttackOptions = {},
): CombatResult {
  const attacker = state.cards[attackerId];
  const defender = state.cards[defenderId];
  if (!attacker || attacker.controller !== playerId) {
    return { success: false, error: "Attacker is not controlled by player." };
  }
  if (!defender || defender.controller === playerId) {
    return { success: false, error: "Defender must be controlled by the opponent." };
  }
  const attackRestrictions = effectiveAttackRestrictions(state, attacker);
  if (attackRestrictions.includes("cannotAttack")) {
    return { success: false, error: "Attacker cannot attack." };
  }
  if (defender.zone === "base" && attackRestrictions.includes("cannotAttackBases")) {
    return { success: false, error: "Attacker cannot attack bases." };
  }
  const attackerKeywords = effectiveKeywords(state, attacker);
  const defenderKeywords = effectiveKeywords(state, defender);
  if (!options.ignoreExhausted && attacker.exhausted)
    return { success: false, error: "Attacker is exhausted." };
  if (
    defenderKeywords.includes("hidden") &&
    defender.playedThisPhase &&
    !defenderKeywords.includes("sentinel")
  ) {
    return { success: false, error: "Defender is hidden." };
  }
  if (!attackerKeywords.includes("saboteur") && blocksBySentinel(state, attacker, defender)) {
    return { success: false, error: "A Sentinel unit must be attacked first." };
  }

  attacker.exhausted = true;
  if (attackerKeywords.includes("saboteur")) defender.shield = 0;

  options.onTrigger?.({ type: "attack", attackerId, defenderId }, playerId);
  options.onTrigger?.({ type: "attacked", attackerId, defenderId }, defender.controller);

  const raidPower = attackerKeywords.includes("raid")
    ? keywordAmountForCard(state, attacker.instanceId, "raid")
    : 0;
  const attackerDamage = effectivePower(state, attacker) + raidPower;
  const defenderRemainingHp = Math.max(0, effectiveHp(state, defender) - defender.damage);
  dealCombatDamage(state, defender, attackerDamage, playerId);
  const defenderDefeatedByFirstStrike =
    defender.zone !== "base" &&
    dealsCombatDamageFirst(state, attacker) &&
    defender.damage >= effectiveHp(state, defender);
  if (attackerKeywords.includes("overwhelm") && defender.zone !== "base") {
    const excessDamage = Math.max(0, attackerDamage - defenderRemainingHp);
    if (excessDamage > 0) {
      const base = Object.values(state.cards).find(
        (card) => card.controller === defender.controller && card.zone === "base",
      );
      if (base) dealCombatDamage(state, base, excessDamage, playerId);
    }
  }
  if (defender.zone !== "base" && !defenderDefeatedByFirstStrike) {
    dealCombatDamage(state, attacker, effectivePower(state, defender), playerId);
  }
  if (attackerKeywords.includes("restore")) {
    const base = Object.values(state.cards).find(
      (card) => card.controller === attacker.controller && card.zone === "base",
    );
    if (base)
      base.damage = Math.max(
        0,
        base.damage - keywordAmountForCard(state, attacker.instanceId, "restore"),
      );
  }

  options.onTrigger?.({ type: "attackEnds", attackerId, defenderId }, playerId);
  defeatLethalUnits(state, playerId, options.onTrigger);
  logMove(state, { playerId, type: "move.attack", message: "Attack resolved.", public: true });
  return { success: true };
}
