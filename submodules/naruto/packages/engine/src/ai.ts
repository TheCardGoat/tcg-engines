/**
 * Greedy AI policy (mirrors the reference engine's offline AI).
 *
 * - Mulligan: keep if the hand has a character.
 * - Choices: score options by power + damage*2 + health/2 with effect-specific
 *   +/-20 modifiers; cancel when the best score is <= 0.
 * - Counter step: activate the first legal set support if the chain is empty,
 *   else pass.
 * - Main: character abilities -> summon highest-stat card (EX if affordable)
 *   -> set support if hand > 2 -> leader effect if chakra > 1 -> board wipe
 *   when behind on board -> attack lethal character targets -> attack leader
 *   -> RECOVERY when out of chakra -> END_TURN.
 */

import { getCardById } from "@tcg-engines/naruto-cards";
import type { CardDefinition } from "@tcg-engines/naruto-cards";

import type { Action } from "./actions";
import { characterAbilityBlock, leaderEffectBlock } from "./effects";
import {
  canBeAttacked,
  canSummonEx,
  characterAttackBlock,
  characterHealth,
  characterPower,
  faceUpChakra,
  hasCharacterRoom,
  leaderAttackBlock,
  leaderUid,
  otherPlayer,
  supportBlock,
  SUPPORT_TEXT_PATTERNS,
} from "./queries";
import { PROVISIONAL_RULES } from "./rules";
import type {
  CharacterInstance,
  ChoiceOption,
  EffectKind,
  GameState,
  PlayerId,
} from "./types";

function statScore(card: CardDefinition | undefined): number {
  return (card?.power ?? 0) + (card?.damage ?? 0) * 2 + (card?.health ?? 0) / 2;
}

/** Heuristic score of a choice option for `player` (higher = better). */
export function scoreOption(
  state: GameState,
  player: PlayerId,
  option: ChoiceOption,
  effect: EffectKind,
): number {
  const own = option.owner === player;
  const card = option.cardId ? getCardById(option.cardId) : undefined;
  const score = statScore(card);
  switch (effect) {
    case "leaderBoost":
    case "doublePower":
      return own ? score + 20 : -score;
    case "freezeTarget":
      return own ? -score : score + 15 * (option.zone !== "leader" ? 1 : 0);
    case "exRequirement":
      return -score;
    case "reviveFromTrash":
    case "searchSummon":
      return score;
    case "koTarget":
    case "bounceTarget":
      return own ? -score - 20 : score + 20;
    case "supportImmune":
      return own ? score + 20 : -score - 20;
    case "leaderPutBack": {
      const instance = state.players[player].hand.find((c) => c.uid === option.key);
      const handCard = instance ? getCardById(instance.cardId) : undefined;
      if (!handCard) return 0;
      if (handCard.cardType === "chakra" || handCard.cardType === "summon") return 100;
      return 50 - ((handCard.power ?? 0) + (handCard.damage ?? 0) * 2);
    }
    default:
      return option.index === null ? 0 : -option.index;
  }
}

interface AttackerCandidate {
  readonly uid: string;
  readonly kind: "leader" | "character";
  readonly power: number;
}

/** Pick the AI's next action, or null when it is not the AI's turn to act. */
export function chooseAiAction(state: GameState, player: PlayerId): Action | null {
  if (state.winner) return null;

  if (state.pendingChoice) {
    const choice = state.pendingChoice;
    if (choice.player !== player) return null;
    const best = [...choice.options].sort(
      (a, b) =>
        scoreOption(state, player, b, choice.effect) - scoreOption(state, player, a, choice.effect),
    )[0];
    if (!best || (choice.cancellable && scoreOption(state, player, best, choice.effect) <= 0)) {
      return { type: "RESOLVE_CHOICE", player, key: null };
    }
    return { type: "RESOLVE_CHOICE", player, key: best.key };
  }

  if (state.awaitingMulligan === player) {
    const keep = state.players[player].hand.some(
      (c) => getCardById(c.cardId)?.cardType === "character",
    );
    return { type: "MULLIGAN", player, keep };
  }

  if (state.step === "counter") {
    if (state.priority !== player) return null;
    const slot = state.players[player].supports.findIndex(
      (support, index) => support !== null && supportBlock(state, player, index) === null,
    );
    if (slot >= 0 && state.chain.length === 0) {
      return { type: "ACTIVATE_SUPPORT", player, slot };
    }
    return { type: "PASS_COUNTER", player };
  }

  if (state.activePlayer !== player || state.phase !== "main") return null;

  const me = state.players[player];
  const opponent = state.players[otherPlayer(player)];

  for (const character of me.characters) {
    if (character && characterAbilityBlock(state, player, character.uid) === null) {
      return { type: "ACTIVATE_CHARACTER", player, uid: character.uid };
    }
  }

  if (hasCharacterRoom(state, player)) {
    let bestIndex = -1;
    let bestScore = -1;
    me.hand.forEach((instance, index) => {
      const card = getCardById(instance.cardId);
      if (!card) return;
      if (card.cardType === "ex_character") {
        if (!canSummonEx(state, player, card.id)) return;
      } else if (card.cardType !== "character") {
        return;
      }
      const score = statScore(card);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    const bestCard = bestIndex >= 0 ? getCardById(me.hand[bestIndex]?.cardId ?? "") : undefined;
    const isNormalCharacter = bestCard?.cardType === "character";
    const instance = bestIndex >= 0 ? me.hand[bestIndex] : undefined;
    if (
      instance &&
      (!isNormalCharacter || me.summonsUsedThisTurn < PROVISIONAL_RULES.normalSummonsPerTurn)
    ) {
      return { type: "SUMMON", player, handUid: instance.uid };
    }
  }

  if (me.supports.some((s) => s === null)) {
    const index = me.hand.findIndex((c) => getCardById(c.cardId)?.support);
    const instance = index >= 0 ? me.hand[index] : undefined;
    if (instance && me.hand.length > 2) {
      return { type: "SET_SUPPORT", player, handUid: instance.uid };
    }
  }

  if (leaderEffectBlock(state, player) === null && faceUpChakra(me) > 1) {
    return { type: "LEADER_EFFECT", player };
  }

  const wipeSlot = me.supports.findIndex((support, index) => {
    if (!support || supportBlock(state, player, index) !== null) return false;
    const card = getCardById(support.cardId);
    if (!card?.support || !SUPPORT_TEXT_PATTERNS.koAll.test(card.support.text)) return false;
    const mine = me.characters.filter((c) => c !== null).length;
    const theirs = opponent.characters.filter((c) => c !== null).length;
    return theirs > mine;
  });
  if (wipeSlot >= 0) {
    return { type: "ACTIVATE_SUPPORT", player, slot: wipeSlot };
  }

  const attackers: AttackerCandidate[] = [];
  for (const character of me.characters) {
    if (character && characterAttackBlock(state, player, character.uid) === null) {
      attackers.push({
        uid: character.uid,
        kind: "character",
        power: characterPower(character, state.turn),
      });
    }
  }
  if (leaderAttackBlock(state, player) === null) {
    const leader = getCardById(me.leaderId);
    attackers.push({ uid: leaderUid(player), kind: "leader", power: leader?.power ?? 0 });
  }

  for (const attacker of attackers) {
    const target = opponent.characters.find(
      (c): c is CharacterInstance =>
        c !== null && canBeAttacked(state, c.uid) && attacker.power >= characterHealth(c) - c.damage,
    );
    if (target) {
      return {
        type: "DECLARE_ATTACK",
        player,
        attackerUid: attacker.uid,
        attackerKind: attacker.kind,
        targetKind: "character",
        targetUid: target.uid,
      };
    }
  }

  const first = attackers[0];
  if (first) {
    return {
      type: "DECLARE_ATTACK",
      player,
      attackerUid: first.uid,
      attackerKind: first.kind,
      targetKind: "leader",
      targetUid: null,
    };
  }

  if (faceUpChakra(me) === 0 && !me.leaderRested && state.turn >= PROVISIONAL_RULES.recoveryFromTurn) {
    return { type: "RECOVERY", player };
  }

  return { type: "END_TURN", player };
}
