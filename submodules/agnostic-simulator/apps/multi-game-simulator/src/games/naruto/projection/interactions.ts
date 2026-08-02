/**
 * Interaction gating for the naruto board: per-entity contextual actions
 * ("pills") with disabled-reason strings, computed purely from engine state
 * via the engine's `*Block` queries plus mirror checks for the few actions
 * without a dedicated block function (SUMMON / SET_SUPPORT / RECOVERY /
 * END_TURN / PASS_COUNTER / MULLIGAN - legality taken from reducer.ts).
 *
 * Intents are UI-level; `intentToAction` converts an intent (+ an optional
 * attack target chosen in the two-step DECLARE_ATTACK flow) into an engine
 * Action for `applyAction`. Illegal actions are filtered here, so a pill
 * click should never produce an engine no-op (same-ref rejection).
 */

import {
  PROVISIONAL_RULES,
  canAct,
  canBeAttacked,
  canSummonEx,
  cardOf,
  characterAbilityBlock,
  characterAttackBlock,
  findCharacter,
  freeSupportSlot,
  handSupportBlock,
  hasCharacterRoom,
  leaderAttackBlock,
  leaderEffectBlock,
  leaderUid,
  otherPlayer,
  supportBlock,
} from "@tcg-engines/naruto-engine";
import type {
  Action,
  AttackerKind,
  BlockReason,
  GameState,
  PlayerId,
  TargetKind,
} from "@tcg-engines/naruto-engine";

import { blockReasonText } from "./labels.ts";

export type NarutoIntent =
  | { readonly kind: "summon"; readonly handUid: string }
  | { readonly kind: "set-support"; readonly handUid: string }
  | { readonly kind: "activate-support"; readonly slot: number }
  | { readonly kind: "activate-support-hand"; readonly handUid: string }
  | { readonly kind: "activate-character"; readonly uid: string }
  | { readonly kind: "leader-effect" }
  | { readonly kind: "recovery" }
  | {
      readonly kind: "declare-attack";
      readonly attackerUid: string;
      readonly attackerKind: AttackerKind;
    }
  | { readonly kind: "pass-counter" }
  | { readonly kind: "end-turn" }
  | { readonly kind: "mulligan"; readonly keep: boolean }
  | { readonly kind: "resolve-choice"; readonly key: string | null };

export interface ActionPill {
  /** Stable pill id, e.g. "summon", "attack", "pass-counter". */
  readonly id: string;
  readonly label: string;
  readonly enabled: boolean;
  /** Humanized disabled reason (tooltip), null when enabled. */
  readonly reason: string | null;
  readonly intent: NarutoIntent;
}

export interface AttackTarget {
  /** Display/DOM uid: character uid or `leader:<playerId>`. */
  readonly uid: string;
  readonly kind: TargetKind;
  /** Engine payload uid: null for leader targets. */
  readonly targetUid: string | null;
}

function pill(
  id: string,
  label: string,
  block: BlockReason | null,
  intent: NarutoIntent,
): ActionPill {
  return { id, label, enabled: block === null, reason: blockReasonText(block), intent };
}

// ---------------------------------------------------------------------------
// Mirror legality checks for actions without an engine *Block query
// ---------------------------------------------------------------------------

export function summonBlock(
  state: GameState,
  player: PlayerId,
  handUid: string,
): BlockReason | null {
  if (!canAct(state, player) || state.step === "counter" || state.activePlayer !== player) {
    return "notYourTurn";
  }
  const instance = state.players[player].hand.find((c) => c.uid === handUid);
  if (!instance) return "conditionUnmet";
  const card = cardOf(instance);
  if (!card || (card.cardType !== "character" && card.cardType !== "ex_character")) {
    return "conditionUnmet";
  }
  if (!hasCharacterRoom(state, player)) return "noSlot";
  if (card.cardType === "ex_character") {
    return canSummonEx(state, player, card.id) ? null : "conditionUnmet";
  }
  if (state.players[player].summonsUsedThisTurn >= PROVISIONAL_RULES.normalSummonsPerTurn) {
    return "alreadyUsed";
  }
  return null;
}

export function setSupportBlock(
  state: GameState,
  player: PlayerId,
  handUid: string,
): BlockReason | null {
  if (!canAct(state, player) || state.step === "counter" || state.activePlayer !== player) {
    return "notYourTurn";
  }
  const instance = state.players[player].hand.find((c) => c.uid === handUid);
  if (!instance) return "conditionUnmet";
  if (!cardOf(instance)?.support) return "conditionUnmet";
  if (freeSupportSlot(state, player) === null) return "noSlot";
  return null;
}

export function recoveryBlock(state: GameState, player: PlayerId): BlockReason | null {
  if (!canAct(state, player) || state.step === "counter" || state.activePlayer !== player) {
    return "notYourTurn";
  }
  if (state.turn < PROVISIONAL_RULES.recoveryFromTurn) return "tooEarly";
  const actor = state.players[player];
  if (actor.leaderRested) return "rested";
  if (state.turn < actor.chakraLockedUntilTurn) return "conditionUnmet";
  return null;
}

export function endTurnBlock(state: GameState, player: PlayerId): BlockReason | null {
  if (state.winner) return "timing";
  if (state.activePlayer !== player) return "notYourTurn";
  if (state.step === "counter" || state.awaitingMulligan) return "timing";
  if (state.pendingChoice) return "timing";
  return null;
}

export function passCounterBlock(state: GameState, player: PlayerId): BlockReason | null {
  if (state.step !== "counter" || state.priority !== player || state.pendingChoice) {
    return "timing";
  }
  return null;
}

export function mulliganBlock(state: GameState, player: PlayerId): BlockReason | null {
  return state.awaitingMulligan === player ? null : "timing";
}

// ---------------------------------------------------------------------------
// Per-entity contextual actions
// ---------------------------------------------------------------------------

/** Actions for a hand card owned by `player` (summon / set / play support). */
export function handCardActions(state: GameState, player: PlayerId, handUid: string): ActionPill[] {
  const instance = state.players[player].hand.find((c) => c.uid === handUid);
  if (!instance) return [];
  const card = cardOf(instance);
  const pills: ActionPill[] = [];
  if (card && (card.cardType === "character" || card.cardType === "ex_character")) {
    pills.push(
      pill("summon", "Summon", summonBlock(state, player, handUid), {
        kind: "summon",
        handUid,
      }),
    );
  }
  if (card?.support) {
    pills.push(
      pill("set-support", "Set support", setSupportBlock(state, player, handUid), {
        kind: "set-support",
        handUid,
      }),
    );
    pills.push(
      pill("activate-support-hand", "Play support", handSupportBlock(state, player, handUid), {
        kind: "activate-support-hand",
        handUid,
      }),
    );
  }
  return pills;
}

/** Actions for a board character owned by `player` (attack / activate). */
export function characterActions(state: GameState, player: PlayerId, uid: string): ActionPill[] {
  const location = findCharacter(state, uid);
  if (!location || location.playerId !== player) return [];
  const pills: ActionPill[] = [
    pill("attack", "Attack", characterAttackBlock(state, player, uid), {
      kind: "declare-attack",
      attackerUid: uid,
      attackerKind: "character",
    }),
  ];
  const abilityBlock = characterAbilityBlock(state, player, uid);
  const card = cardOf(location.character);
  const hasActivate = card?.skills.some((skill) =>
    skill.labels.some((label) => /^activate\s*:\s*main$/i.test(label.trim())),
  );
  if (hasActivate) {
    pills.push(
      pill("activate-character", "Activate", abilityBlock, { kind: "activate-character", uid }),
    );
  }
  return pills;
}

/** Actions for a set support slot owned by `player`. */
export function supportSlotActions(state: GameState, player: PlayerId, slot: number): ActionPill[] {
  const support = state.players[player].supports[slot];
  if (!support) return [];
  return [
    pill("activate-support", "Activate", supportBlock(state, player, slot), {
      kind: "activate-support",
      slot,
    }),
  ];
}

/** Actions on the player's own leader (attack / leader effect / recovery). */
export function leaderActions(state: GameState, player: PlayerId): ActionPill[] {
  const leader = state.players[player];
  const card = cardOf({ uid: leaderUid(player), cardId: leader.leaderId });
  const pills: ActionPill[] = [
    pill("attack", "Attack", leaderAttackBlock(state, player), {
      kind: "declare-attack",
      attackerUid: leaderUid(player),
      attackerKind: "leader",
    }),
  ];
  const hasLeaderEffect = card?.skills.some((skill) =>
    skill.labels.some((label) => /^activate\s*:\s*main$/i.test(label.trim())),
  );
  if (hasLeaderEffect || leaderEffectBlock(state, player) === null) {
    pills.push(
      pill("leader-effect", "Leader effect", leaderEffectBlock(state, player), {
        kind: "leader-effect",
      }),
    );
  }
  pills.push(pill("recovery", "Recovery", recoveryBlock(state, player), { kind: "recovery" }));
  return pills;
}

/** Seam-level actions: pass counter (priority holder) and end turn. */
export function tableActions(state: GameState, player: PlayerId): ActionPill[] {
  const pills: ActionPill[] = [];
  if (state.step === "counter") {
    pills.push(
      pill("pass-counter", "Pass", passCounterBlock(state, player), { kind: "pass-counter" }),
    );
  } else {
    pills.push(pill("end-turn", "End turn", endTurnBlock(state, player), { kind: "end-turn" }));
  }
  return pills;
}

/** Mulligan pills for the pre-game banner. */
export function mulliganActions(state: GameState, player: PlayerId): ActionPill[] {
  const block = mulliganBlock(state, player);
  return [
    pill("mulligan-keep", "Keep hand", block, { kind: "mulligan", keep: true }),
    pill("mulligan-redraw", "Redraw", block, { kind: "mulligan", keep: false }),
  ];
}

/** Legal targets for an attacker: the opposing leader + attackable characters. */
export function legalAttackTargets(
  state: GameState,
  player: PlayerId,
  attackerUid: string,
  attackerKind: AttackerKind,
): AttackTarget[] {
  const attackBlock =
    attackerKind === "leader"
      ? leaderAttackBlock(state, player)
      : characterAttackBlock(state, player, attackerUid);
  if (attackBlock !== null) return [];
  const opponent = otherPlayer(player);
  const targets: AttackTarget[] = [{ uid: leaderUid(opponent), kind: "leader", targetUid: null }];
  state.players[opponent].characters.forEach((character) => {
    if (character && canBeAttacked(state, character.uid)) {
      targets.push({ uid: character.uid, kind: "character", targetUid: character.uid });
    }
  });
  return targets;
}

/** Convert an intent (+ chosen target for declare-attack) into an engine Action. */
export function intentToAction(
  player: PlayerId,
  intent: NarutoIntent,
  target?: AttackTarget,
): Action {
  switch (intent.kind) {
    case "summon":
      return { type: "SUMMON", player, handUid: intent.handUid };
    case "set-support":
      return { type: "SET_SUPPORT", player, handUid: intent.handUid };
    case "activate-support":
      return { type: "ACTIVATE_SUPPORT", player, slot: intent.slot };
    case "activate-support-hand":
      return { type: "ACTIVATE_SUPPORT_FROM_HAND", player, handUid: intent.handUid };
    case "activate-character":
      return { type: "ACTIVATE_CHARACTER", player, uid: intent.uid };
    case "leader-effect":
      return { type: "LEADER_EFFECT", player };
    case "recovery":
      return { type: "RECOVERY", player };
    case "declare-attack": {
      const resolved: AttackTarget = target ?? {
        uid: leaderUid(otherPlayer(player)),
        kind: "leader",
        targetUid: null,
      };
      return {
        type: "DECLARE_ATTACK",
        player,
        attackerUid: intent.attackerUid,
        attackerKind: intent.attackerKind,
        targetKind: resolved.kind,
        targetUid: resolved.targetUid,
      };
    }
    case "pass-counter":
      return { type: "PASS_COUNTER", player };
    case "end-turn":
      return { type: "END_TURN", player };
    case "mulligan":
      return { type: "MULLIGAN", player, keep: intent.keep };
    case "resolve-choice":
      return { type: "RESOLVE_CHOICE", player, key: intent.key };
  }
}
