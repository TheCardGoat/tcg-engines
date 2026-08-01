/**
 * Pure, UI-facing queries over game state. None of these mutate state.
 *
 * "Block" functions return a string reason when an action/activation is
 * illegal, or null when it is legal — mirroring the reference engine's
 * reason strings ("noChakra", "alreadyUsed", "conditionUnmet", "timing",
 * "noTarget", "noSlot", "notYourTurn", "tooEarly", "rested",
 * "summoningSickness", "noAttackLeft", "frozen").
 */

import { getCardById } from "@tcg-engines/naruto-cards";
import type { CardDefinition } from "@tcg-engines/naruto-cards";

import { PROVISIONAL_RULES } from "./rules";
import type {
  CardInstance,
  CharacterInstance,
  ChoiceOption,
  GameState,
  PlayerId,
  PlayerState,
} from "./types";

export type BlockReason =
  | "noChakra"
  | "alreadyUsed"
  | "conditionUnmet"
  | "timing"
  | "noTarget"
  | "noSlot"
  | "notYourTurn"
  | "tooEarly"
  | "rested"
  | "summoningSickness"
  | "noAttackLeft"
  | "frozen";

export type SupportTiming = "counter" | "main" | "quick" | "response" | "unknown";

export function cardOf(instance: CardInstance): CardDefinition | undefined {
  return getCardById(instance.cardId);
}

export function otherPlayer(player: PlayerId): PlayerId {
  return player === "p1" ? "p2" : "p1";
}

/** Alias of {@link otherPlayer} (the defender relative to an actor). */
export const opponentOf = otherPlayer;

/** Who must act next: the turn router for UI/comm layers. */
export function deciderOf(state: GameState): PlayerId | null {
  if (state.winner) return null;
  if (state.pendingChoice) return state.pendingChoice.player;
  if (state.awaitingMulligan) return state.awaitingMulligan;
  if (state.step === "counter") return state.priority;
  return state.activePlayer;
}

export function newCharacter(uid: string, cardId: string, turn: number): CharacterInstance {
  return {
    uid,
    cardId,
    rested: false,
    damage: 0,
    summonedOnTurn: turn,
    powerBonus: 0,
    damageBonus: 0,
    attacksUsed: 0,
    cannotAttackUntilTurn: 0,
    rushUntilTurn: 0,
    activatedThisTurn: false,
    powerDoubledUntilTurn: 0,
    supportImmuneUntilTurn: 0,
    effectsNegated: false,
  };
}

/** [bracket] names in a skill text, excluding keyword labels like [Rush]. */
export function bracketNames(text: string): string[] {
  return Array.from(text.matchAll(/\[([^\]]+)\]/g))
    .map((m) => m[1] ?? "")
    .filter((name) => !/^(rush|blocker|double attack)$/i.test(name));
}

/** Power including bonuses and this-turn doubling. */
export function effectivePower(character: CharacterInstance, turn: number): number {
  const base = (cardOf(character)?.power ?? 0) + character.powerBonus;
  return character.powerDoubledUntilTurn >= turn ? 2 * base : base;
}

/**
 * Printed power + bonuses. Doubling only applies when a concrete `turn` is
 * passed (matches the reference, which defaults to a never-active doubling).
 */
export function characterPower(
  character: CharacterInstance,
  turn: number = Number.MAX_SAFE_INTEGER,
): number {
  return effectivePower(character, turn);
}

export function characterHealth(character: CharacterInstance): number {
  return cardOf(character)?.health ?? 0;
}

export function leaderUid(player: PlayerId): string {
  return `leader:${player}`;
}

export function faceUpChakra(player: PlayerState): number {
  return player.chakra.filter((c) => c.faceUp).length;
}

export interface CharacterLocation {
  readonly playerId: PlayerId;
  readonly index: number;
  readonly character: CharacterInstance;
}

export function findCharacter(state: GameState, uid: string): CharacterLocation | null {
  for (const playerId of ["p1", "p2"] as const) {
    const index = state.players[playerId].characters.findIndex((c) => c?.uid === uid);
    if (index >= 0) {
      const character = state.players[playerId].characters[index];
      if (character) return { playerId, index, character };
    }
  }
  return null;
}

/** All characters on the given players' boards, as choice options. */
export function boardCharacters(
  state: GameState,
  playerIds: readonly PlayerId[],
): ChoiceOption[] {
  const options: ChoiceOption[] = [];
  for (const owner of playerIds) {
    state.players[owner].characters.forEach((character, index) => {
      if (character) {
        options.push({
          zone: "character",
          key: character.uid,
          owner,
          cardId: character.cardId,
          index,
        });
      }
    });
  }
  return options;
}

export function hasCharacterRoom(state: GameState, player: PlayerId): boolean {
  const limit = PROVISIONAL_RULES.characterLimit;
  return (
    limit === null ||
    state.players[player].characters.filter((c) => c !== null).length < limit
  );
}

/**
 * Slot index a new character would occupy: first empty slot, or one past the
 * end (the board grows past the 5 shown slots). null when the board is full.
 */
export function nextCharacterSlot(state: GameState, player: PlayerId): number | null {
  if (!hasCharacterRoom(state, player)) return null;
  const characters = state.players[player].characters;
  const empty = characters.findIndex((c) => c === null);
  return empty >= 0 ? empty : characters.length;
}

export function freeSupportSlot(state: GameState, player: PlayerId): number | null {
  const index = state.players[player].supports.findIndex((s) => s === null);
  return index >= 0 ? index : null;
}

/** 1-based chain position of a support card (on the chain or resolving). */
export function chainLinkOf(state: GameState, uid: string): number | null {
  const index = state.chain.findIndex((link) => link.uid === uid);
  if (index >= 0) return index + 1;
  if (state.resolvingSupport?.uid === uid) return state.chain.length + 1;
  return null;
}

/** Immune to an opponent's support effect while `supportImmuneUntilTurn` holds. */
export function isImmuneTo(
  state: GameState,
  character: CharacterInstance,
  sourcePlayer: PlayerId,
  targetOwner: PlayerId,
): boolean {
  return targetOwner !== sourcePlayer && character.supportImmuneUntilTurn >= state.turn;
}

/** Board characters that `sourcePlayer`'s support effects can target. */
export function supportableTargets(
  state: GameState,
  sourcePlayer: PlayerId,
  playerIds: readonly PlayerId[],
): ChoiceOption[] {
  return boardCharacters(state, playerIds).filter((option) => {
    const character =
      option.index === null ? null : state.players[option.owner].characters[option.index];
    return character !== null && character !== undefined
      ? !isImmuneTo(state, character, sourcePlayer, option.owner)
      : false;
  });
}

export interface KoFilter {
  readonly restedOnly: boolean;
  readonly nonEx: boolean;
}

/** Immunity-respecting KO candidates for a support effect. */
export function koTargets(state: GameState, sourcePlayer: PlayerId, filter: KoFilter): ChoiceOption[] {
  return supportableTargets(state, sourcePlayer, ["p1", "p2"]).filter((option) => {
    const character =
      option.index === null ? null : state.players[option.owner].characters[option.index];
    if (!character) return false;
    if (filter.restedOnly && !character.rested) return false;
    if (filter.nonEx && cardOf(character)?.cardType === "ex_character") return false;
    return true;
  });
}

/** Only rested characters can be attacked (provisional rules). */
export function canBeAttacked(state: GameState, uid: string): boolean {
  const location = findCharacter(state, uid);
  return (
    location !== null &&
    (PROVISIONAL_RULES.canAttackStandingCharacter || location.character.rested)
  );
}

/** May `player` take a normal action right now? */
export function canAct(state: GameState, player: PlayerId): boolean {
  return (
    !state.winner &&
    !state.pendingChoice &&
    (state.awaitingMulligan
      ? state.awaitingMulligan === player
      : state.step === "counter"
        ? state.priority === player
        : state.activePlayer === player && state.phase === "main")
  );
}

/** Native or conditional Rush, checked live. */
export function hasRush(character: CharacterInstance, turn: number): boolean {
  if (character.rushUntilTurn >= turn) return true;
  const card = cardOf(character);
  if (!card || character.effectsNegated) return false;
  return (
    card.skills.some((skill) => skill.labels.some((label) => /^rush$/i.test(label.trim()))) ||
    card.skills.some((skill) => {
      if (!/gains \[rush\]/i.test(skill.text)) return false;
      const match = /has (\d+) or more power/i.exec(skill.text);
      return match !== null && effectivePower(character, turn) >= Number(match[1]);
    })
  );
}

export function characterAttackBlock(
  state: GameState,
  player: PlayerId,
  uid: string,
): BlockReason | null {
  if (!canAct(state, player) || state.step === "counter" || state.activePlayer !== player) {
    return "notYourTurn";
  }
  if (PROVISIONAL_RULES.noAttackOnFirstTurn && state.turn <= 2) return "tooEarly";
  const location = findCharacter(state, uid);
  if (!location || location.playerId !== player) return "notYourTurn";
  const character = location.character;
  if (character.rested) return "rested";
  if (character.summonedOnTurn === state.turn && !hasRush(character, state.turn)) {
    return "summoningSickness";
  }
  if (character.attacksUsed >= PROVISIONAL_RULES.attacksPerCharacter) return "noAttackLeft";
  if (state.turn <= character.cannotAttackUntilTurn) return "frozen";
  return null;
}

export function leaderAttackBlock(state: GameState, player: PlayerId): BlockReason | null {
  if (!PROVISIONAL_RULES.leaderCanAttack) return "noAttackLeft";
  if (!canAct(state, player) || state.step === "counter" || state.activePlayer !== player) {
    return "notYourTurn";
  }
  if (PROVISIONAL_RULES.noAttackOnFirstTurn && state.turn <= 2) return "tooEarly";
  const playerState = state.players[player];
  if (playerState.leaderRested) return "rested";
  if (playerState.leaderAttacksUsed >= PROVISIONAL_RULES.leaderAttacksPerTurn) {
    return "noAttackLeft";
  }
  if (state.turn <= playerState.leaderCannotAttackUntilTurn) return "frozen";
  return null;
}

// ---------------------------------------------------------------------------
// Support cards: timing classes and activation legality
// ---------------------------------------------------------------------------

export const SUPPORT_TEXT_PATTERNS = {
  negate: /negate that card/i,
  lifeCost: /reduce your life by (\d+)/i,
  chakraLock: /cannot turn your chakra face-up/i,
  interrupt: /interrupt/i,
  lifeGain: /you gain (\d+) life/i,
  powerDoubled: /power is doubled/i,
  supportImmunity: /will not be affected by your opponent'?s support effects/i,
  summonThisCard: /summon this card/i,
  koAll: /k\.?\s?o\.?\s+all characters/i,
  koChosen: /k\.?\s?o\.?\s+the chosen cards?/i,
  bounce: /return the chosen card to the owner'?s hand/i,
} as const;

export function supportTimingClass(card: CardDefinition | undefined): SupportTiming {
  const timing = card?.support?.timing;
  if (!timing) return "unknown";
  if (/support activated/i.test(timing)) return "response";
  if (/^\s*quick\s*$/i.test(timing)) return "quick";
  if (/opponent'?s attack/i.test(timing)) return "counter";
  if (/your main/i.test(timing)) return "main";
  return "unknown";
}

/**
 * Legality of activating a support card (shared by set and from-hand plays).
 * `ignorePriority` skips the counter-step priority check (used when probing
 * "does this player have ANY activatable support").
 */
export function supportActivationBlock(
  state: GameState,
  player: PlayerId,
  instance: CardInstance,
  ignorePriority: boolean,
): BlockReason | null {
  const card = cardOf(instance);
  if (!card?.support) return "conditionUnmet";
  const timing = supportTimingClass(card);
  const inAttackCounter = state.step === "counter" && state.pendingAttack !== null;
  const chainActive = inAttackCounter || state.chain.length > 0;
  const isDefender = otherPlayer(state.pendingAttack?.attacker ?? player) === player;

  if (!ignorePriority && state.step === "counter" && state.priority !== null && state.priority !== player) {
    return "timing";
  }
  if (timing === "counter") {
    if (!inAttackCounter || !isDefender) return "timing";
  } else if (timing === "main") {
    if (inAttackCounter || state.activePlayer !== player || state.phase !== "main") {
      return "timing";
    }
  } else if (timing === "quick") {
    const usableOnOwnMain = !chainActive && state.activePlayer === player && state.phase === "main";
    if (!usableOnOwnMain && !chainActive) return "timing";
  } else if (timing === "response") {
    const last = state.chain[state.chain.length - 1];
    if (!last || last.player === player) return "timing";
  } else {
    return "timing";
  }

  if (faceUpChakra(state.players[player]) < (card.support.cost ?? 0)) return "noChakra";
  if (SUPPORT_TEXT_PATTERNS.summonThisCard.test(card.support.text) && !hasCharacterRoom(state, player)) {
    return "noSlot";
  }
  return null;
}

/** Legality of revealing the set support in `slot`. */
export function supportBlock(
  state: GameState,
  player: PlayerId,
  slot: number,
  ignorePriority = false,
): BlockReason | null {
  const support = state.players[player].supports[slot];
  if (!support) return "conditionUnmet";
  if (support.revealed) return "alreadyUsed";
  return supportActivationBlock(state, player, support, ignorePriority);
}

/** Legality of playing a support straight from hand (your turn only). */
export function handSupportBlock(
  state: GameState,
  player: PlayerId,
  handUid: string,
  ignorePriority = false,
): BlockReason | null {
  if (!PROVISIONAL_RULES.supportFromHandOnYourTurn) return "timing";
  const instance = state.players[player].hand.find((c) => c.uid === handUid);
  if (!instance) return "conditionUnmet";
  const card = cardOf(instance);
  if (!card?.support) return "conditionUnmet";
  if (state.activePlayer !== player) return "timing";
  return supportActivationBlock(state, player, instance, ignorePriority);
}

/** Any activatable support, set or in hand (priority check skipped). */
export function hasActivatableSupport(state: GameState, player: PlayerId): boolean {
  return (
    state.players[player].supports.some(
      (support, slot) => support !== null && supportBlock(state, player, slot, true) === null,
    ) ||
    state.players[player].hand.some((card) => handSupportBlock(state, player, card.uid, true) === null)
  );
}

// ---------------------------------------------------------------------------
// EX summon requirements ("place X and Y in your trash")
// ---------------------------------------------------------------------------

export interface ExRequirement {
  readonly minPower?: number;
  readonly trait?: string;
}

/** Parse the summon requirements of an EX character's skill text. */
export function exRequirements(cardId: string): readonly ExRequirement[] {
  const card = getCardById(cardId);
  if (!card) return [];
  for (const skill of card.skills) {
    const match = /place (.+?) in your trash/i.exec(skill.text);
    if (match?.[1]) {
      return match[1].split(/\s+and\s+/i).map((part) => {
        const requirement: { minPower?: number; trait?: string } = {};
        const power = /with (\d+) or more power/i.exec(part);
        if (power?.[1]) requirement.minPower = Number(power[1]);
        const trait = /\{([^}]+)\}\s*type/i.exec(part);
        if (trait?.[1]) requirement.trait = trait[1];
        return requirement;
      });
    }
  }
  return [];
}

/** Your board characters satisfying one requirement, excluding `paid` uids. */
export function requirementCandidates(
  state: GameState,
  player: PlayerId,
  requirement: ExRequirement,
  paid: readonly string[],
): ChoiceOption[] {
  return boardCharacters(state, [player]).filter((option) => {
    if (paid.includes(option.key)) return false;
    const character =
      option.index === null ? null : state.players[player].characters[option.index];
    if (!character) return false;
    if (requirement.minPower !== undefined && effectivePower(character, state.turn) < requirement.minPower) {
      return false;
    }
    if (requirement.trait !== undefined && !(cardOf(character)?.traits ?? []).includes(requirement.trait)) {
      return false;
    }
    return true;
  });
}

/** Recursive assignment check: can every remaining requirement be satisfied? */
export function requirementAssignable(
  state: GameState,
  player: PlayerId,
  requirements: readonly ExRequirement[],
  step: number,
  paid: readonly string[],
): boolean {
  if (step >= requirements.length) return true;
  for (const option of requirementCandidates(state, player, requirements[step] ?? {}, paid)) {
    if (requirementAssignable(state, player, requirements, step + 1, [...paid, option.key])) {
      return true;
    }
  }
  return false;
}

/** Candidates for `step` that still allow the remaining steps to be satisfied. */
export function requirementOptions(
  state: GameState,
  player: PlayerId,
  cardId: string,
  step: number,
  paid: readonly string[],
): ChoiceOption[] {
  const requirements = exRequirements(cardId);
  if (step >= requirements.length) return [];
  return requirementCandidates(state, player, requirements[step] ?? {}, paid).filter((option) =>
    requirementAssignable(state, player, requirements, step + 1, [...paid, option.key]),
  );
}

/** Can this EX character's summon requirements currently be met? */
export function canSummonEx(state: GameState, player: PlayerId, cardId: string): boolean {
  const requirements = exRequirements(cardId);
  return requirements.length === 0 || requirementAssignable(state, player, requirements, 0, []);
}
