/**
 * The pure reducer: applyAction(state, action) -> state.
 *
 * - No side effects, no I/O. Illegal actions return the SAME state reference.
 * - Legal actions shallow-copy state and return a new object.
 * - Turn flow: startTurn unrests + draws (1 first turn / 2 after, deck-out
 *   loses), END_TURN wipes damage/bonuses and passes to the next player.
 * - Combat: DECLARE_ATTACK opens the counter window (priority to defender),
 *   supports chain, two consecutive passes resolve the chain LIFO, then the
 *   attack resolves.
 */

import { getCardById } from "@tcg-engines/naruto-cards";

import type { Action } from "./actions";
import {
  characterAbilityBlock,
  leaderEffectBlock,
  resolveChoice,
  runCharacterAbility,
  runOnSummonTriggers,
  runSupportEffect,
  runWhenAttackingTriggers,
  startExSummon,
  startLeaderEffect,
} from "./effects";
import { pushLog } from "./log";
import {
  canAct,
  canBeAttacked,
  canSummonEx,
  cardOf,
  characterAttackBlock,
  effectivePower,
  findCharacter,
  freeSupportSlot,
  handSupportBlock,
  hasActivatableSupport,
  leaderAttackBlock,
  otherPlayer,
  supportBlock,
} from "./queries";
import { shuffle } from "./rng";
import { OFFICIAL_RULES, PROVISIONAL_RULES } from "./rules";
import { copyPlayer, koCheck, payChakra, placeCharacter, settleChainLink } from "./state-ops";
import type { GameState, PlayerId } from "./types";

// ---------------------------------------------------------------------------
// Turn flow
// ---------------------------------------------------------------------------

function drawCards(state: GameState, player: PlayerId, count: number): void {
  const playerState = state.players[player];
  for (let i = 0; i < count; i += 1) {
    const card = playerState.deck.shift();
    if (!card) {
      if (PROVISIONAL_RULES.deckOutLoses && !state.winner) {
        state.winner = otherPlayer(player);
        pushLog(state, "system", "log.deckOut", { player: playerState.name });
      }
      return;
    }
    playerState.hand.push(card);
  }
  pushLog(state, player, "log.draw", { count });
}

/** Unrest, reset per-turn flags, draw (deck-out loses), enter main phase. */
export function startTurn(state: GameState): void {
  const active = state.players[state.activePlayer];
  for (const character of active.characters) {
    if (character) {
      character.rested = false;
      character.attacksUsed = 0;
      character.activatedThisTurn = false;
    }
  }
  active.leaderRested = false;
  active.leaderAttacksUsed = 0;
  active.summonRested = false;
  active.summonsUsedThisTurn = 0;
  active.leaderUsedThisTurn = false;
  state.phase = "draw";
  const count = state.turn === 1 ? PROVISIONAL_RULES.firstTurnDraw : PROVISIONAL_RULES.normalDraw;
  drawCards(state, state.activePlayer, count);
  state.phase = "main";
}

// ---------------------------------------------------------------------------
// Combat and the chain
// ---------------------------------------------------------------------------

/** Who gets priority next: the opponent if they can respond, else (counter step) the actor. */
function nextPriority(state: GameState, player: PlayerId): PlayerId | null {
  const opponent = otherPlayer(player);
  if (hasActivatableSupport(state, opponent)) return opponent;
  if (state.step === "counter" && hasActivatableSupport(state, player)) return player;
  return null;
}

function resolveAttack(state: GameState): void {
  const attack = state.pendingAttack;
  if (!attack) return;
  state.pendingAttack = null;

  let damage = 0;
  let power = 0;
  let attackerName = "";
  if (attack.attackerKind === "leader") {
    const leader = getCardById(state.players[attack.attacker].leaderId);
    if (!leader) return;
    damage = leader.damage ?? 0;
    power = leader.power ?? 0;
    attackerName = leader.nameEn;
  } else {
    const location = findCharacter(state, attack.attackerUid);
    if (!location) return;
    const attacker = location.character;
    damage = (cardOf(attacker)?.damage ?? 0) + attacker.damageBonus;
    power = effectivePower(attacker, state.turn);
    attackerName = cardOf(attacker)?.nameEn ?? "";
  }

  if (attack.targetKind === "leader") {
    const defender = state.players[otherPlayer(attack.attacker)];
    const amount = PROVISIONAL_RULES.damageToLeaderUses === "damage" ? damage : power;
    defender.life = Math.max(0, defender.life - amount);
    pushLog(state, attack.attacker, "log.hitLeader", { amount, life: defender.life });
    if (defender.life === 0) {
      state.winner = attack.attacker;
      pushLog(state, "system", "log.victory", {
        player: state.players[attack.attacker].name,
      });
    }
    return;
  }

  const target = findCharacter(state, attack.targetUid ?? "");
  if (!target) return;
  const amount = PROVISIONAL_RULES.damageToCharacterUses === "power" ? power : damage;
  target.character.damage += amount;
  pushLog(state, attack.attacker, "log.hitCharacter", {
    card: cardOf(target.character)?.nameEn ?? "",
    amount,
    attacker: attackerName,
  });
  koCheck(state);
}

/** Resolve the support chain LIFO (suspending on choices), then the attack. */
export function resolveChain(state: GameState): void {
  while (state.chain.length > 0) {
    const link = state.chain[state.chain.length - 1];
    if (!link) break;
    state.chain = state.chain.slice(0, -1);
    const result = runSupportEffect(state, link.player, link);
    if (state.pendingChoice) {
      state.resolvingSupport = { ...link, keepsCard: result.keepsCard };
      koCheck(state);
      return;
    }
    settleChainLink(state, link, result.keepsCard);
    koCheck(state);
  }
  state.priority = null;
  state.consecutivePasses = 0;
  state.step = "normal";
  if (state.pendingAttack) resolveAttack(state);
}

// ---------------------------------------------------------------------------
// The reducer
// ---------------------------------------------------------------------------

export function applyAction(state: GameState, action: Action): GameState {
  if (state.winner && action.type !== "MULLIGAN") return state;

  const next: GameState = {
    ...state,
    players: {
      p1: copyPlayer(state.players.p1),
      p2: copyPlayer(state.players.p2),
    },
    pendingAttack: state.pendingAttack ? { ...state.pendingAttack } : null,
    pendingChoice: state.pendingChoice
      ? {
          ...state.pendingChoice,
          options: state.pendingChoice.options.map((option) => ({ ...option })),
        }
      : null,
    chain: state.chain.map((link) => ({ ...link })),
    log: [...state.log],
  };
  const actor = next.players[action.player];

  if (next.pendingChoice && action.type !== "RESOLVE_CHOICE") return state;

  switch (action.type) {
    case "MULLIGAN": {
      if (next.awaitingMulligan !== action.player) return state;
      if (action.keep) {
        pushLog(next, action.player, "log.keepHand");
      } else {
        actor.deck = [...actor.hand, ...actor.deck];
        const shuffled = shuffle(actor.deck, next.seed);
        actor.deck = shuffled.items;
        next.seed = shuffled.seed;
        actor.hand = [];
        for (let i = 0; i < PROVISIONAL_RULES.openingHand; i += 1) {
          const card = actor.deck.shift();
          if (card) actor.hand.push(card);
        }
        pushLog(next, action.player, "log.mulligan");
      }
      actor.mulliganDone = true;
      next.awaitingMulligan = null;
      startTurn(next);
      return next;
    }

    case "SUMMON": {
      if (!canAct(next, action.player) || next.step === "counter") return state;
      const handIndex = actor.hand.findIndex((c) => c.uid === action.handUid);
      if (handIndex < 0) return state;
      const instance = actor.hand[handIndex];
      if (!instance) return state;
      const card = cardOf(instance);
      if (!card || (card.cardType !== "character" && card.cardType !== "ex_character")) {
        return state;
      }
      if (card.cardType === "ex_character") {
        // EX characters go through the exRequirement choice flow instead.
        if (!canSummonEx(next, action.player, card.id)) return state;
        if (!startExSummon(next, action.player, action.handUid)) return state;
        koCheck(next);
        return next;
      }
      if (actor.summonsUsedThisTurn >= PROVISIONAL_RULES.normalSummonsPerTurn) return state;
      const slot = placeCharacter(next, action.player, instance);
      if (slot === null) return state;
      actor.summonsUsedThisTurn += 1;
      actor.summonRested = true;
      actor.hand.splice(handIndex, 1);
      pushLog(next, action.player, "log.summon", { card: card.nameEn });
      runOnSummonTriggers(next, action.player, slot);
      koCheck(next);
      return next;
    }

    case "SET_SUPPORT": {
      if (!canAct(next, action.player) || next.step === "counter") return state;
      const handIndex = actor.hand.findIndex((c) => c.uid === action.handUid);
      if (handIndex < 0) return state;
      const instance = actor.hand[handIndex];
      if (!instance) return state;
      const card = cardOf(instance);
      if (!card?.support) return state;
      const slot = freeSupportSlot(next, action.player);
      if (slot === null) return state;
      actor.hand.splice(handIndex, 1);
      actor.supports[slot] = { uid: instance.uid, cardId: instance.cardId };
      pushLog(next, action.player, "log.setSupport");
      return next;
    }

    case "ACTIVATE_SUPPORT": {
      if (next.winner || next.awaitingMulligan) return state;
      if (supportBlock(next, action.player, action.slot) !== null) return state;
      const support = actor.supports[action.slot];
      if (!support) return state;
      const card = cardOf(support);
      if (!card?.support || !payChakra(actor, card.support.cost ?? 0)) return state;
      actor.supports[action.slot] = { ...support, revealed: true };
      next.chain = [
        ...next.chain,
        { player: action.player, uid: support.uid, cardId: support.cardId },
      ];
      next.consecutivePasses = 0;
      pushLog(next, action.player, "log.addToChain", {
        card: card.support.name,
        link: next.chain.length,
      });
      const priority = nextPriority(next, action.player);
      if (priority) {
        next.step = "counter";
        next.priority = priority;
        return next;
      }
      next.priority = null;
      resolveChain(next);
      return next;
    }

    case "ACTIVATE_SUPPORT_FROM_HAND": {
      if (next.winner || next.awaitingMulligan) return state;
      if (handSupportBlock(next, action.player, action.handUid) !== null) return state;
      const handIndex = actor.hand.findIndex((c) => c.uid === action.handUid);
      if (handIndex < 0) return state;
      const instance = actor.hand[handIndex];
      if (!instance) return state;
      const card = cardOf(instance);
      if (!card?.support || !payChakra(actor, card.support.cost ?? 0)) return state;
      actor.hand.splice(handIndex, 1);
      next.chain = [
        ...next.chain,
        { player: action.player, uid: instance.uid, cardId: instance.cardId },
      ];
      next.consecutivePasses = 0;
      pushLog(next, action.player, "log.playFromHand", {
        card: card.support.name,
        link: next.chain.length,
      });
      const priority = nextPriority(next, action.player);
      if (priority) {
        next.step = "counter";
        next.priority = priority;
        return next;
      }
      next.priority = null;
      resolveChain(next);
      return next;
    }

    case "ACTIVATE_CHARACTER": {
      if (!canAct(next, action.player) || next.step === "counter") return state;
      if (characterAbilityBlock(next, action.player, action.uid) !== null) return state;
      if (!runCharacterAbility(next, action.player, action.uid)) return state;
      return next;
    }

    case "LEADER_EFFECT": {
      if (!canAct(next, action.player) || next.step === "counter") return state;
      if (leaderEffectBlock(next, action.player) !== null) return state;
      if (!startLeaderEffect(next, action.player)) return state;
      koCheck(next);
      return next;
    }

    case "RECOVERY": {
      if (!canAct(next, action.player) || next.step === "counter") return state;
      if (next.turn < PROVISIONAL_RULES.recoveryFromTurn) return state;
      if (actor.leaderRested) return state;
      if (next.turn < actor.chakraLockedUntilTurn) return state;
      actor.leaderRested = true;
      for (const chakra of actor.chakra) chakra.faceUp = true;
      pushLog(next, action.player, "log.recovery");
      return next;
    }

    case "DECLARE_ATTACK": {
      const block =
        action.attackerKind === "leader"
          ? leaderAttackBlock(next, action.player)
          : characterAttackBlock(next, action.player, action.attackerUid);
      if (block !== null) return state;
      if (action.targetKind === "character") {
        const target = findCharacter(next, action.targetUid ?? "");
        if (!target || target.playerId === action.player) return state;
        if (!canBeAttacked(next, action.targetUid ?? "")) return state;
      }
      const attackerName =
        action.attackerKind === "leader"
          ? (getCardById(actor.leaderId)?.nameEn ?? "")
          : (cardOf(findCharacter(next, action.attackerUid)?.character ?? { uid: "", cardId: "" })
              ?.nameEn ?? "");
      if (action.attackerKind === "leader") {
        actor.leaderAttacksUsed += 1;
        if (PROVISIONAL_RULES.attackingRestsAttacker) actor.leaderRested = true;
      } else {
        const attacker = findCharacter(next, action.attackerUid);
        if (!attacker) return state;
        attacker.character.attacksUsed += 1;
        if (PROVISIONAL_RULES.attackingRestsAttacker) attacker.character.rested = true;
      }
      next.pendingAttack = {
        attackerUid: action.attackerUid,
        attacker: action.player,
        attackerKind: action.attackerKind,
        targetKind: action.targetKind,
        targetUid: action.targetUid,
      };
      next.step = "counter";
      next.chain = [];
      next.consecutivePasses = 0;
      next.priority = otherPlayer(action.player);
      pushLog(next, action.player, "log.declareAttack", { card: attackerName });
      if (action.attackerKind === "character") {
        runWhenAttackingTriggers(next, action.player, action.attackerUid);
        koCheck(next);
      }
      return next;
    }

    case "PASS_COUNTER": {
      if (next.step !== "counter" || next.priority !== action.player) return state;
      next.consecutivePasses += 1;
      pushLog(next, action.player, "log.passPriority");
      if (next.chain.length > 0 && next.consecutivePasses < 2) {
        const priority = nextPriority(next, action.player);
        if (priority && priority !== action.player) {
          next.priority = priority;
          return next;
        }
      }
      next.priority = null;
      resolveChain(next);
      return next;
    }

    case "RESOLVE_CHOICE": {
      if (!next.pendingChoice) return state;
      if (!resolveChoice(next, action.player, action.key)) return state;
      koCheck(next);
      if (!next.pendingChoice) {
        const resolving = next.resolvingSupport;
        if (resolving) {
          next.resolvingSupport = null;
          settleChainLink(next, resolving, resolving.keepsCard);
          koCheck(next);
        }
        if (next.chain.length > 0 || (next.step === "counter" && next.priority === null)) {
          resolveChain(next);
        }
      }
      return next;
    }

    case "END_TURN": {
      if (next.activePlayer !== action.player) return state;
      if (next.step === "counter" || next.awaitingMulligan) return state;
      if (PROVISIONAL_RULES.damageWipesAtEndOfTurn) {
        for (const playerId of ["p1", "p2"] as const) {
          for (const character of next.players[playerId].characters) {
            if (character) {
              character.damage = 0;
              character.powerBonus = 0;
              character.damageBonus = 0;
            }
          }
        }
      }
      next.activePlayer = otherPlayer(next.activePlayer);
      next.turn += 1;
      next.phase = "refresh";
      pushLog(next, "system", "log.turnStart", { turn: next.turn });
      startTurn(next);
      return next;
    }
  }
}
