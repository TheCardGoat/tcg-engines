/**
 * Effect system. Effects are NOT data-driven; two mechanisms mirror the
 * reference engine:
 *
 * a) Explicit support effects (`runSupportEffect`) — reviewed behavior is
 *    keyed by card id so scraped display text cannot become executable code.
 * b) Hardcoded per-card-id character/leader effects — implemented as typed
 *    registries (`CHARACTER_EFFECTS`, `LEADER_EFFECTS`) mapping card id to
 *    handlers, so new cards are easy to add.
 *
 * The universal interaction primitive is `pendingChoice`: an effect queues a
 * choice, the player answers with RESOLVE_CHOICE, and the dispatch may
 * re-queue follow-up choices (multi-KO, multi-step EX cost). Single
 * non-cancellable options auto-resolve.
 */

import { getCardById } from "@tcg-engines/naruto-cards";
import type { CardDefinition } from "@tcg-engines/naruto-cards";

import { pushLog } from "./log";
import {
  boardCharacters,
  canSummonEx,
  cardOf,
  exRequirements,
  findCharacter,
  hasCharacterRoom,
  isImmuneTo,
  isImmuneToEffect,
  koTargets,
  leaderUid,
  otherPlayer,
  requirementAssignable,
  requirementOptions,
  supportableTargets,
} from "./queries";
import type { BlockReason } from "./queries";
import { PROVISIONAL_RULES } from "./rules";
import { supportEffectOf } from "./support-effects";
import { drawCards, placeCharacter, removeSupportFromSlot } from "./state-ops";
import type {
  CardInstance,
  ChainLink,
  ChoiceOption,
  GameState,
  PendingChoice,
  PlayerId,
} from "./types";

// ---------------------------------------------------------------------------
// Choice queueing and dispatch
// ---------------------------------------------------------------------------

/**
 * Queue a choice for `state.pendingChoice`. Zero options cancel silently; a
 * single non-cancellable option (without alwaysAsk) resolves immediately.
 */
export function queueChoice(state: GameState, choice: PendingChoice): void {
  if (choice.options.length === 0) {
    state.pendingChoice = null;
    return;
  }
  if (choice.options.length === 1 && !choice.cancellable && !choice.alwaysAsk) {
    state.pendingChoice = choice;
    const only = choice.options[0];
    if (only) dispatchChoice(state, choice, only);
    return;
  }
  state.pendingChoice = choice;
}

/**
 * Answer the pending choice. `key: null` cancels when cancellable.
 * Returns false when the answer is not acceptable (caller returns same state).
 */
export function resolveChoice(state: GameState, player: PlayerId, key: string | null): boolean {
  const choice = state.pendingChoice;
  if (!choice || choice.player !== player) return false;
  if (key === null) {
    if (!choice.cancellable) return false;
    state.pendingChoice = null;
    pushLog(state, player, "log.choiceCancelled");
    return true;
  }
  const option = choice.options.find((o) => o.key === key);
  if (!option) return false;
  dispatchChoice(state, choice, option);
  return true;
}

function dispatchChoice(state: GameState, choice: PendingChoice, option: ChoiceOption): void {
  state.pendingChoice = null;
  switch (choice.effect) {
    case "leaderBoost":
      resolveLeaderBoost(state, choice.player, option);
      return;
    case "leaderPutBack":
      resolveLeaderPutBack(state, choice.player, option);
      return;
    case "exRequirement":
      resolveExRequirement(state, choice, option);
      return;
    case "reviveFromTrash":
      resolveReviveFromTrash(state, choice, option);
      return;
    case "freezeTarget":
      resolveFreezeTarget(state, choice.player, option);
      return;
    case "koTarget":
      resolveKoTarget(state, choice, option);
      return;
    case "bounceTarget":
      resolveBounceTarget(state, choice.player, option);
      return;
    case "doublePower":
      resolveDoublePowerLike(state, choice, option, "double");
      return;
    case "supportImmune":
      resolveDoublePowerLike(state, choice, option, "immune");
      return;
    case "searchSummon":
      resolveSearchSummon(state, choice, option);
      return;
  }
}

// ---------------------------------------------------------------------------
// Choice resolutions
// ---------------------------------------------------------------------------

function resolveLeaderBoost(state: GameState, player: PlayerId, option: ChoiceOption): void {
  const playerState = state.players[player];
  const chakra = playerState.chakra.find((c) => c.faceUp);
  const location = findCharacter(state, option.key);
  if (!chakra || !location) return;
  const character = state.players[location.playerId].characters[location.index];
  if (!character) return;
  chakra.faceUp = false;
  character.powerBonus += 3;
  playerState.leaderUsedThisTurn = true;
  if (PROVISIONAL_RULES.leaderEffectRestsLeader) playerState.leaderRested = true;
  pushLog(state, player, "log.leaderBoost", { card: cardOf(character)?.nameEn ?? "" });
}

function resolveLeaderPutBack(state: GameState, player: PlayerId, option: ChoiceOption): void {
  const playerState = state.players[player];
  const index = playerState.hand.findIndex((c) => c.uid === option.key);
  if (index < 0) return;
  const [card] = playerState.hand.splice(index, 1);
  if (card) playerState.deck.unshift(card);
  playerState.leaderUsedThisTurn = true;
  if (PROVISIONAL_RULES.leaderEffectRestsLeader) playerState.leaderRested = true;
  pushLog(state, player, "log.leaderDig");
}

function resolveExRequirement(state: GameState, choice: PendingChoice, option: ChoiceOption): void {
  const player = choice.player;
  const playerState = state.players[player];
  const location = findCharacter(state, option.key);
  if (!location || location.playerId !== player) return;
  const character = playerState.characters[location.index];
  if (!character) return;

  const paidSoFar = String(choice.data["paid"] ?? "");
  const paidList = paidSoFar ? paidSoFar.split(",") : [];
  const step = Number(choice.data["step"] ?? 0);
  const requirements = exRequirements(choice.source);
  if (!requirementAssignable(state, player, requirements, step + 1, [...paidList, option.key])) {
    return;
  }

  playerState.characters[location.index] = null;
  playerState.trash.push({ uid: character.uid, cardId: character.cardId });
  pushLog(state, player, "log.summonRequirementPaid", {
    card: cardOf(character)?.nameEn ?? "",
  });

  const paid = paidSoFar ? `${paidSoFar},${option.key}` : option.key;
  const nextStep = step + 1;
  const handUid = String(choice.data["handUid"] ?? "");

  if (nextStep < requirements.length) {
    const options = requirementOptions(state, player, choice.source, nextStep, paid.split(","));
    if (options.length === 0) return;
    queueChoice(state, {
      effect: "exRequirement",
      sourceKind: "character",
      source: choice.source,
      player,
      promptKey: "choice.exRequirement",
      options,
      cancellable: false,
      data: { handUid, step: nextStep, paid },
    });
    return;
  }

  const slot = placeCharacter(state, player, { uid: handUid, cardId: choice.source });
  if (slot === null) return;
  const handIndex = playerState.hand.findIndex((c) => c.uid === handUid);
  const handCard = handIndex >= 0 ? playerState.hand[handIndex] : undefined;
  if (handIndex < 0 || !handCard) {
    // Roll back the placement: the EX card is not actually in hand.
    playerState.characters[slot] = null;
    return;
  }
  playerState.hand.splice(handIndex, 1);
  pushLog(state, player, "log.summon", { card: cardOf(handCard)?.nameEn ?? "" });
  runOnSummonTriggers(state, player, slot);
}

function resolveReviveFromTrash(
  state: GameState,
  choice: PendingChoice,
  option: ChoiceOption,
): void {
  const player = choice.player;
  const playerState = state.players[player];
  const trashIndex = playerState.trash.findIndex((c) => c.uid === option.key);
  if (trashIndex < 0) return;
  const target = playerState.trash[trashIndex];
  if (!target) return;
  if (!hasCharacterRoom(state, player)) return;
  const slot = placeCharacter(state, player, target);
  if (slot === null) return;
  playerState.trash.splice(trashIndex, 1);
  pushLog(state, player, "log.summonFromTrash", { card: cardOf(target)?.nameEn ?? "" });
  runOnSummonTriggers(state, player, slot);
}

function resolveFreezeTarget(state: GameState, player: PlayerId, option: ChoiceOption): void {
  const playerState = state.players[player];
  const top = playerState.deck[0];
  const topCard = top ? cardOf(top) : undefined;
  pushLog(state, player, "log.reveal", { card: topCard?.nameEn ?? "" });
  if (!topCard?.traits.includes("Uchiha Clan")) {
    pushLog(state, player, "log.revealNoMatch");
    return;
  }
  if (option.zone === "leader") {
    state.players[option.owner].leaderCannotAttackUntilTurn = state.turn + 1;
    pushLog(state, player, "log.frozen", {
      card: getCardById(state.players[option.owner].leaderId)?.nameEn ?? "",
    });
    return;
  }
  const location = findCharacter(state, option.key);
  if (!location) return;
  const character = state.players[location.playerId].characters[location.index];
  if (!character) return;
  character.cannotAttackUntilTurn = state.turn + 1;
  pushLog(state, player, "log.frozen", { card: cardOf(character)?.nameEn ?? "" });
}

function koChosenCharacter(
  state: GameState,
  sourcePlayer: PlayerId,
  sourceKind: PendingChoice["sourceKind"],
  uid: string,
): void {
  const location = findCharacter(state, uid);
  if (!location) return;
  const owner = state.players[location.playerId];
  const character = owner.characters[location.index];
  if (
    !character ||
    isImmuneToEffect(state, character, sourceKind, sourcePlayer, location.playerId)
  ) {
    return;
  }
  owner.characters[location.index] = null;
  owner.trash.push({ uid: character.uid, cardId: character.cardId });
  pushLog(state, sourcePlayer, "log.koTarget", { card: cardOf(character)?.nameEn ?? "" });
}

function resolveKoTarget(state: GameState, choice: PendingChoice, option: ChoiceOption): void {
  const player = choice.player;
  koChosenCharacter(state, player, choice.sourceKind, option.key);
  const remaining = Number(choice.data["remaining"] ?? 0);
  if (remaining <= 0) return;
  const takenSoFar = String(choice.data["taken"] ?? "");
  const taken = takenSoFar ? `${takenSoFar},${option.key}` : option.key;
  const restedOnly = Number(choice.data["restedOnly"] ?? 0) === 1;
  const nonEx = Number(choice.data["nonEx"] ?? 0) === 1;
  const options = koTargets(state, player, choice.sourceKind, { restedOnly, nonEx }).filter(
    (o) => !taken.split(",").includes(o.key),
  );
  if (options.length === 0) return;
  queueChoice(state, {
    effect: "koTarget",
    sourceKind: choice.sourceKind,
    source: choice.source,
    player,
    promptKey: choice.promptKey,
    options,
    cancellable: true,
    data: {
      remaining: remaining - 1,
      taken,
      restedOnly: restedOnly ? 1 : 0,
      nonEx: nonEx ? 1 : 0,
    },
  });
}

function resolveBounceTarget(state: GameState, player: PlayerId, option: ChoiceOption): void {
  const location = findCharacter(state, option.key);
  if (!location) return;
  const owner = state.players[location.playerId];
  const character = owner.characters[location.index];
  if (!character || isImmuneTo(state, character, player, location.playerId)) return;
  owner.characters[location.index] = null;
  owner.hand.push({ uid: character.uid, cardId: character.cardId });
  pushLog(state, player, "log.bounce", { card: cardOf(character)?.nameEn ?? "" });
}

/**
 * "power is doubled" / "support immune" choices: tag the chosen character,
 * then the support card itself is summoned as a character (kept, not trashed).
 */
function resolveDoublePowerLike(
  state: GameState,
  choice: PendingChoice,
  option: ChoiceOption,
  kind: "double" | "immune",
): void {
  const location = findCharacter(state, option.key);
  if (location) {
    const character = state.players[location.playerId].characters[location.index];
    if (character) {
      if (kind === "double") {
        character.powerDoubledUntilTurn = state.turn;
        pushLog(state, choice.player, "log.powerDoubled", {
          card: cardOf(character)?.nameEn ?? "",
        });
      } else {
        character.supportImmuneUntilTurn = state.turn;
        pushLog(state, choice.player, "log.supportImmune", {
          card: cardOf(character)?.nameEn ?? "",
        });
      }
    }
  }
  const player = choice.player;
  const instance: CardInstance = {
    uid: String(choice.data["uid"] ?? ""),
    cardId: String(choice.data["cardId"] ?? ""),
  };
  const slot = placeCharacter(state, player, instance);
  if (slot === null) return;
  pushLog(state, player, "log.summon", { card: getCardById(instance.cardId)?.nameEn ?? "" });
  runOnSummonTriggers(state, player, slot);
}

function resolveSearchSummon(state: GameState, choice: PendingChoice, option: ChoiceOption): void {
  const player = choice.player;
  if (!hasCharacterRoom(state, player)) return;
  const slot = placeCharacter(state, player, { uid: option.key, cardId: option.cardId });
  if (slot === null) return;
  const playerState = state.players[player];
  const zone = option.zone === "deck" ? playerState.deck : playerState.trash;
  const index = zone.findIndex((c) => c.uid === option.key);
  if (index < 0) {
    playerState.characters[slot] = null;
    return;
  }
  const [card] = zone.splice(index, 1);
  const character = playerState.characters[slot];
  if (!card || !character) return;
  character.effectsNegated = true;
  pushLog(state, player, "log.summonNegated", { card: getCardById(card.cardId)?.nameEn ?? "" });
}

// ---------------------------------------------------------------------------
// Shared summon helpers
// ---------------------------------------------------------------------------

/** Summon a support card itself as a character (e.g. "Summon this card"). */
export function summonCardAsCharacter(
  state: GameState,
  player: PlayerId,
  instance: CardInstance,
): { keepsCard: boolean } {
  const slot = placeCharacter(state, player, instance);
  if (slot === null) return { keepsCard: false };
  pushLog(state, player, "log.summon", { card: getCardById(instance.cardId)?.nameEn ?? "" });
  runOnSummonTriggers(state, player, slot);
  return { keepsCard: true };
}

/** Reveal the top deck card; if it matches `predicate`, summon it. */
export function revealTopAndSummon(
  state: GameState,
  player: PlayerId,
  predicate: (card: CardDefinition) => boolean,
): void {
  const playerState = state.players[player];
  const top = playerState.deck[0];
  const topCard = top ? cardOf(top) : undefined;
  pushLog(state, player, "log.reveal", { card: topCard?.nameEn ?? "" });
  if (!topCard || !predicate(topCard)) {
    pushLog(state, player, "log.revealNoMatch");
    return;
  }
  if (!hasCharacterRoom(state, player)) {
    pushLog(state, player, "log.revealNoMatch");
    return;
  }
  const slot = placeCharacter(state, player, { uid: top?.uid ?? "", cardId: top?.cardId ?? "" });
  if (slot === null) {
    pushLog(state, player, "log.revealNoMatch");
    return;
  }
  playerState.deck.shift();
  pushLog(state, player, "log.summon", { card: topCard.nameEn });
  runOnSummonTriggers(state, player, slot);
}

// ---------------------------------------------------------------------------
// Character effect registry (hardcoded per card id)
// ---------------------------------------------------------------------------

export interface CharacterEffectHandler {
  /** "On Summon" trigger, fired after the character enters play. */
  readonly onSummon?: (state: GameState, owner: PlayerId, slot: number) => void;
  /** "When Attacking" trigger, fired on DECLARE_ATTACK. */
  readonly whenAttacking?: (state: GameState, owner: PlayerId, uid: string) => void;
  /** Extra legality condition for "Activate: Main" abilities. */
  readonly activateMainBlock?: (
    state: GameState,
    owner: PlayerId,
    uid: string,
  ) => BlockReason | null;
  /** "Activate: Main" ability body. */
  readonly activateMain?: (state: GameState, owner: PlayerId, uid: string) => void;
  /** Whether the reviewed Activate: Main handler is limited to once each turn. */
  readonly activateMainOncePerTurn?: boolean;
}

const TEAM_10_CARD_IDS = new Set(["N-008", "N-011", "N-choji"]);
const N005_REVIVE_CARD_IDS = new Set([
  "N-004",
  "N-006",
  "N-007",
  "N-reveal-04",
  "N-reveal-05",
  "N-reveal-08",
]);
const NARUTO_EX_SEARCH_CARD_IDS = new Set(["N-004", "N-naruto-ex", "N-reveal-04", "N-reveal-08"]);
const N019_REVEAL_CARD_IDS = new Set([
  "N-010",
  "N-015",
  "N-019",
  "N-021",
  "N-reveal-03",
  "N-reveal-07",
]);

function trashOptionsMatching(
  state: GameState,
  owner: PlayerId,
  predicate: (card: CardDefinition) => boolean,
): ChoiceOption[] {
  const options: ChoiceOption[] = [];
  state.players[owner].trash.forEach((instance, index) => {
    const card = cardOf(instance);
    if (card && predicate(card)) {
      options.push({
        zone: "trash",
        key: instance.uid,
        owner,
        cardId: instance.cardId,
        index,
      });
    }
  });
  return options;
}

function deckOptionsMatching(
  state: GameState,
  owner: PlayerId,
  predicate: (card: CardDefinition) => boolean,
): ChoiceOption[] {
  const options: ChoiceOption[] = [];
  state.players[owner].deck.forEach((instance, index) => {
    const card = cardOf(instance);
    if (card && predicate(card)) {
      options.push({
        zone: "deck",
        key: instance.uid,
        owner,
        cardId: instance.cardId,
        index,
      });
    }
  });
  return options;
}

export const CHARACTER_EFFECTS: Readonly<Record<string, CharacterEffectHandler>> = {
  // N-013 Itachi Uchiha — On Summon: reveal top; if Uchiha Clan, chosen
  // character/leader cannot attack until next turn.
  "N-013": {
    onSummon: (state, owner) => {
      const leaderOptions: ChoiceOption[] = (["p1", "p2"] as const).map((playerId) => ({
        zone: "leader",
        key: leaderUid(playerId),
        owner: playerId,
        cardId: state.players[playerId].leaderId,
        index: null,
      }));
      queueChoice(state, {
        effect: "freezeTarget",
        sourceKind: "character",
        source: "N-013",
        player: owner,
        promptKey: "choice.freezeTarget",
        options: [...leaderOptions, ...boardCharacters(state, ["p1", "p2"])],
        cancellable: false,
        data: {},
      });
    },
  },

  // N-005 Gamabunta — On Summon: summon 1 non-EX [bracket-named] character
  // from your trash.
  "N-005": {
    onSummon: (state, owner) => {
      if (!hasCharacterRoom(state, owner)) return;
      const options = trashOptionsMatching(
        state,
        owner,
        (c) => c.cardType === "character" && N005_REVIVE_CARD_IDS.has(c.id),
      );
      queueChoice(state, {
        effect: "reviveFromTrash",
        sourceKind: "character",
        source: "N-005",
        player: owner,
        promptKey: "choice.reviveFromTrash",
        options,
        cancellable: false,
        data: {},
      });
    },
  },

  // N-014 Sasuke Uchiha (EX) — On Summon: K.O. any 1 character.
  "N-014": {
    onSummon: (state, owner) => {
      const options = koTargets(state, owner, "character", { restedOnly: false, nonEx: false });
      if (options.length === 0) return;
      queueChoice(state, {
        effect: "koTarget",
        sourceKind: "character",
        source: "N-014",
        player: owner,
        promptKey: "choice.koTarget",
        options,
        cancellable: false,
        alwaysAsk: true,
        data: { remaining: 0, taken: "", restedOnly: 0, nonEx: 0 },
      });
    },
  },

  // N-naruto-ex — On Summon: summon up to 1 [bracket-named] character from
  // your deck or trash with its effects negated.
  "N-naruto-ex": {
    onSummon: (state, owner) => {
      if (!hasCharacterRoom(state, owner)) return;
      const isCharacter = (c: CardDefinition) =>
        c.cardType === "character" || c.cardType === "ex_character";
      const options = [
        ...deckOptionsMatching(
          state,
          owner,
          (c) => isCharacter(c) && NARUTO_EX_SEARCH_CARD_IDS.has(c.id),
        ),
        ...trashOptionsMatching(
          state,
          owner,
          (c) => isCharacter(c) && NARUTO_EX_SEARCH_CARD_IDS.has(c.id),
        ),
      ];
      queueChoice(state, {
        effect: "searchSummon",
        sourceKind: "character",
        source: "N-naruto-ex",
        player: owner,
        promptKey: "choice.searchSummon",
        options,
        cancellable: true,
        data: {},
      });
    },
  },

  // N-022 Manda — On Summon: reveal top; if a (non-EX) character, summon it.
  "N-022": {
    onSummon: (state, owner) => {
      revealTopAndSummon(state, owner, (c) => c.cardType === "character");
    },
  },

  // N-019 Jugo — When Attacking: reveal top; if a [Sasuke Uchiha] or
  // {The Taka} non-EX character, summon it.
  "N-019": {
    whenAttacking: (state, owner) => {
      revealTopAndSummon(
        state,
        owner,
        (c) => c.cardType === "character" && N019_REVEAL_CARD_IDS.has(c.id),
      );
    },
  },

  // N-011 Ino Yamanaka — Activate: Main (once/turn): with Shikamaru + Choji
  // on board, all three gain Rush, +5 power, +1 damage this turn.
  "N-011": {
    activateMainOncePerTurn: true,
    activateMainBlock: (state, owner) => {
      const cardIds = state.players[owner].characters
        .filter((c) => c !== null)
        .map((c) => c.cardId);
      return cardIds.includes("N-008") && cardIds.includes("N-choji") ? null : "conditionUnmet";
    },
    activateMain: (state, owner, uid) => {
      for (const character of state.players[owner].characters) {
        if (!character) continue;
        if (TEAM_10_CARD_IDS.has(character.cardId)) {
          character.powerBonus += 5;
          character.damageBonus += 1;
          character.rushUntilTurn = state.turn;
        }
      }
      const self = findCharacter(state, uid);
      pushLog(state, owner, "log.teamBoost", {
        card: self ? (cardOf(self.character)?.nameEn ?? "") : "",
      });
    },
  },
} as const;

/** Fire a summoned character's "On Summon" trigger (registry-driven). */
export function runOnSummonTriggers(state: GameState, owner: PlayerId, slot: number): void {
  const character = state.players[owner].characters[slot];
  if (!character || character.effectsNegated) return;
  CHARACTER_EFFECTS[character.cardId]?.onSummon?.(state, owner, slot);
}

/** Fire an attacker's "When Attacking" trigger (registry-driven). */
export function runWhenAttackingTriggers(state: GameState, owner: PlayerId, uid: string): void {
  const character = state.players[owner].characters.find((c) => c?.uid === uid);
  if (!character || character.effectsNegated) return;
  CHARACTER_EFFECTS[character.cardId]?.whenAttacking?.(state, owner, uid);
}

/** Whether a reviewed handler exposes an Activate: Main character ability. */
export function hasCharacterActivateMain(cardId: string): boolean {
  return CHARACTER_EFFECTS[cardId]?.activateMain !== undefined;
}

// ---------------------------------------------------------------------------
// "Activate: Main" character abilities
// ---------------------------------------------------------------------------

export function characterAbilityBlock(
  state: GameState,
  player: PlayerId,
  uid: string,
): BlockReason | null {
  const character = state.players[player].characters.find((c) => c?.uid === uid);
  if (!character || character.effectsNegated) {
    return "conditionUnmet";
  }
  const handler = CHARACTER_EFFECTS[character.cardId];
  if (!handler?.activateMain || !handler.activateMainBlock) return "conditionUnmet";
  if (handler.activateMainOncePerTurn && character.activatedThisTurn) return "alreadyUsed";
  return handler.activateMainBlock(state, player, uid);
}

/** Run a character's "Activate: Main" ability. False when illegal. */
export function runCharacterAbility(state: GameState, player: PlayerId, uid: string): boolean {
  if (characterAbilityBlock(state, player, uid) !== null) return false;
  const character = state.players[player].characters.find((c) => c?.uid === uid);
  if (!character) return false;
  const handler = CHARACTER_EFFECTS[character.cardId];
  if (!handler?.activateMain) return false;
  character.activatedThisTurn = true;
  handler.activateMain(state, player, uid);
  return true;
}

// ---------------------------------------------------------------------------
// Leader "Activate: Main" effects
// ---------------------------------------------------------------------------

export interface LeaderEffectHandler {
  /** Extra legality conditions beyond the generic once-per-turn check. */
  readonly block?: (state: GameState, player: PlayerId) => BlockReason | null;
  readonly run: (state: GameState, player: PlayerId) => void;
  readonly oncePerTurn?: boolean;
}

export const LEADER_EFFECTS: Readonly<Record<string, LeaderEffectHandler>> = {
  // N-001 Naruto — flip 1 chakra, chosen character gets +3 power this turn.
  "N-001": {
    oncePerTurn: true,
    block: (state, player) => {
      if (!state.players[player].chakra.some((c) => c.faceUp)) return "noChakra";
      if (boardCharacters(state, ["p1", "p2"]).length === 0) return "noTarget";
      return null;
    },
    run: (state, player) => {
      queueChoice(state, {
        effect: "leaderBoost",
        sourceKind: "leader",
        source: "N-001",
        player,
        promptKey: "choice.leaderBoost",
        options: boardCharacters(state, ["p1", "p2"]),
        cancellable: true,
        data: {},
      });
    },
  },

  // N-012 Sasuke — draw 1, then put a hand card back on top of the deck.
  "N-012": {
    oncePerTurn: true,
    run: (state, player) => {
      const playerState = state.players[player];
      drawCards(state, player, 1);
      if (state.winner) return;
      const options: ChoiceOption[] = playerState.hand.map((instance, index) => ({
        zone: "hand",
        key: instance.uid,
        owner: player,
        cardId: instance.cardId,
        index,
      }));
      if (options.length === 0) {
        playerState.leaderUsedThisTurn = true;
        if (PROVISIONAL_RULES.leaderEffectRestsLeader) playerState.leaderRested = true;
        return;
      }
      queueChoice(state, {
        effect: "leaderPutBack",
        sourceKind: "leader",
        source: "N-012",
        player,
        promptKey: "choice.leaderPutBack",
        options,
        cancellable: false,
        data: {},
      });
    },
  },
} as const;

/** Whether a reviewed handler exposes a leader effect. */
export function hasLeaderEffect(cardId: string): boolean {
  return LEADER_EFFECTS[cardId] !== undefined;
}

export function leaderEffectBlock(state: GameState, player: PlayerId): BlockReason | null {
  const playerState = state.players[player];
  const leader = getCardById(playerState.leaderId);
  if (!leader) return "conditionUnmet";
  const handler = LEADER_EFFECTS[leader.id];
  if (!handler) return "conditionUnmet";
  if (handler.oncePerTurn && playerState.leaderUsedThisTurn) return "alreadyUsed";
  return handler.block?.(state, player) ?? null;
}

/** Start a leader effect. False when illegal. */
export function startLeaderEffect(state: GameState, player: PlayerId): boolean {
  if (leaderEffectBlock(state, player) !== null) return false;
  const playerState = state.players[player];
  const leader = getCardById(playerState.leaderId);
  const handler = leader ? LEADER_EFFECTS[leader.id] : undefined;
  if (!handler) return false;
  handler.run(state, player);
  return true;
}

// ---------------------------------------------------------------------------
// EX summon flow
// ---------------------------------------------------------------------------

/** Open the multi-step exRequirement choice flow for an EX summon. */
export function startExSummon(state: GameState, player: PlayerId, handUid: string): boolean {
  const instance = state.players[player].hand.find((c) => c.uid === handUid);
  if (!instance || !canSummonEx(state, player, instance.cardId)) return false;
  if (exRequirements(instance.cardId).length === 0) return false;
  const options = requirementOptions(state, player, instance.cardId, 0, []);
  if (options.length === 0) return false;
  queueChoice(state, {
    effect: "exRequirement",
    sourceKind: "character",
    source: instance.cardId,
    player,
    promptKey: "choice.exRequirement",
    options,
    cancellable: false,
    data: { handUid, step: 0, paid: "" },
  });
  return true;
}

// ---------------------------------------------------------------------------
// Explicit support effects
// ---------------------------------------------------------------------------

export interface SupportEffectResult {
  /** True when the support card stays in play (it became a character). */
  readonly keepsCard: boolean;
}

/** Run one chain link's support effect. May queue a pendingChoice. */
export function runSupportEffect(
  state: GameState,
  player: PlayerId,
  link: ChainLink,
): SupportEffectResult {
  const card = getCardById(link.cardId);
  if (!card?.support) return { keepsCard: false };
  const effect = supportEffectOf(link.cardId);
  if (!effect) return { keepsCard: false };

  // Negate the previous chain link (its support goes to the trash).
  if (effect.negate) {
    const previous = state.chain[state.chain.length - 1];
    if (previous) {
      state.chain = state.chain.slice(0, -1);
      removeSupportFromSlot(state, previous.player, previous.uid);
      state.players[previous.player].trash.push({
        uid: previous.uid,
        cardId: previous.cardId,
      });
      pushLog(state, player, "log.negated", {
        card: getCardById(previous.cardId)?.support?.name ?? "",
      });
    }
    if (effect.negate.lifeCost) {
      const playerState = state.players[player];
      playerState.life = Math.max(0, playerState.life - effect.negate.lifeCost);
      pushLog(state, player, "log.lifeCost", {
        amount: effect.negate.lifeCost,
        life: playerState.life,
      });
      if (playerState.life === 0) {
        state.winner = otherPlayer(player);
        pushLog(state, player, "log.victory", {
          player: state.players[otherPlayer(player)].name,
        });
      }
    }
    if (effect.negate.chakraLock) {
      const lockedFrom = state.turn + (state.activePlayer === player ? 2 : 1);
      state.players[player].chakraLockedUntilTurn = lockedFrom + 1;
      pushLog(state, player, "log.chakraLocked");
    }
    return { keepsCard: false };
  }

  // Interrupt: cancel the pending attack entirely.
  if (effect.interrupt && state.step === "counter") {
    const attack = state.pendingAttack;
    if (attack && !PROVISIONAL_RULES.interruptedAttackUsesAttacker) {
      if (attack.attackerKind === "leader") {
        const attacker = state.players[attack.attacker];
        attacker.leaderAttacksUsed = Math.max(0, attacker.leaderAttacksUsed - 1);
        attacker.leaderRested = false;
      } else {
        for (const playerId of ["p1", "p2"] as const) {
          const character = state.players[playerId].characters.find(
            (c) => c?.uid === attack.attackerUid,
          );
          if (character) {
            character.attacksUsed = Math.max(0, character.attacksUsed - 1);
            character.rested = false;
          }
        }
      }
    }
    state.pendingAttack = null;
    pushLog(state, player, "log.attackInterrupted");
  }

  // Life gain.
  if (effect.lifeGain) {
    const amount = effect.lifeGain;
    state.players[player].life += amount;
    pushLog(state, player, "log.lifeGain", { amount, life: state.players[player].life });
  }

  // "Power is doubled": tag a character, then summon this card.
  if (effect.doublePower) {
    const options = supportableTargets(state, player, ["p1", "p2"]);
    if (options.length === 0) return summonCardAsCharacter(state, player, link);
    queueChoice(state, {
      effect: "doublePower",
      sourceKind: "support",
      source: link.cardId,
      player,
      promptKey: "choice.doublePower",
      options,
      cancellable: false,
      data: { uid: link.uid, cardId: link.cardId },
    });
    return { keepsCard: true };
  }

  // "Will not be affected by support effects": tag a character, then summon.
  if (effect.supportImmunity) {
    const options = boardCharacters(state, ["p1", "p2"]);
    if (options.length === 0) return summonCardAsCharacter(state, player, link);
    queueChoice(state, {
      effect: "supportImmune",
      sourceKind: "support",
      source: link.cardId,
      player,
      promptKey: "choice.supportImmune",
      options,
      cancellable: false,
      data: { uid: link.uid, cardId: link.cardId },
    });
    return { keepsCard: true };
  }

  // "Summon this card".
  if (effect.summonThisCard) {
    return summonCardAsCharacter(state, player, link);
  }

  // Board wipe (respecting support immunity).
  if (effect.koAll) {
    for (const playerId of ["p1", "p2"] as const) {
      state.players[playerId].characters.forEach((character, index) => {
        if (!character || isImmuneTo(state, character, player, playerId)) return;
        state.players[playerId].characters[index] = null;
        state.players[playerId].trash.push({ uid: character.uid, cardId: character.cardId });
        pushLog(state, playerId, "log.characterTrashed", {
          card: cardOf(character)?.nameEn ?? "",
        });
      });
    }
    const sourceCard = getCardById(link.cardId);
    pushLog(state, player, "log.koAll", {
      card: sourceCard?.support?.name ?? sourceCard?.nameEn ?? "Support effect",
    });
    return { keepsCard: false };
  }

  // Targeted KO choice flow ("K.O. the chosen card(s)", "up to N", rested, non-EX).
  if (effect.koChosen) {
    const { count, upTo = false, restedOnly = false, nonEx = false } = effect.koChosen;
    const options = koTargets(state, player, "support", { restedOnly, nonEx });
    if (options.length > 0) {
      queueChoice(state, {
        effect: "koTarget",
        sourceKind: "support",
        source: link.cardId,
        player,
        promptKey: "choice.koTarget",
        options,
        cancellable: upTo,
        alwaysAsk: true,
        data: {
          remaining: count - 1,
          taken: "",
          restedOnly: restedOnly ? 1 : 0,
          nonEx: nonEx ? 1 : 0,
        },
      });
    }
    return { keepsCard: false };
  }

  // Bounce a character to its owner's hand.
  if (effect.bounce) {
    const options = supportableTargets(state, player, ["p1", "p2"]);
    if (options.length === 0) return { keepsCard: false };
    queueChoice(state, {
      effect: "bounceTarget",
      sourceKind: "support",
      source: link.cardId,
      player,
      promptKey: "choice.bounceTarget",
      options,
      cancellable: false,
      data: {},
    });
    return { keepsCard: false };
  }

  return { keepsCard: false };
}
