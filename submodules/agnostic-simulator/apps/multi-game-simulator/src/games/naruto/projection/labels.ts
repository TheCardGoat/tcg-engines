/**
 * English labels for the naruto engine's i18n keys (log.* / choice.*),
 * BlockReason humanization, phase/step labels, and deck-issue text.
 *
 * The engine emits keys + value bags (see packages/engine/src/log.ts and
 * effects.ts promptKey values); the UI localizes here so the engine stays
 * UI-free. Fallback is the raw key so missing keys are visible, not silent.
 */

import { getCardById } from "@tcg-engines/naruto-cards";
import type { BlockReason, DeckIssue, LogEntry, Phase, Step } from "@tcg-engines/naruto-engine";

export function cardName(cardId: string): string {
  return getCardById(cardId)?.nameEn ?? cardId;
}

export function cardImageUrl(cardId: string): string {
  return getCardById(cardId)?.image ?? `/images/cards/en/${cardId}.webp`;
}

export const CARD_BACK_URL = "/images/cards/backs/back-character.webp";

const LOG_TEMPLATES: Record<string, string> = {
  "log.gameStart": "The game begins.",
  "log.keepHand": "{actor} keeps their hand.",
  "log.mulligan": "{actor} shuffles back and redraws.",
  "log.turnStart": "Turn {turn} begins.",
  "log.draw": "{actor} draws a card.",
  "log.deckOut": "{actor} cannot draw - decked out.",
  "log.summon": "{actor} summons {card}.",
  "log.summonFromTrash": "{card} returns from the trash.",
  "log.summonNegated": "{card}'s summon is negated.",
  "log.summonRequirementPaid": "{card} is placed in the trash as a summon requirement.",
  "log.setSupport": "{actor} sets a support card.",
  "log.addToChain": "{card} is added to the chain (link {link}).",
  "log.playFromHand": "{actor} plays {card} from hand (link {link}).",
  "log.passPriority": "{actor} passes.",
  "log.declareAttack": "{card} declares an attack!",
  "log.attackInterrupted": "The attack is interrupted.",
  "log.hitLeader": "{card} hits {target}'s leader for {damage}.",
  "log.hitCharacter": "{card} hits {target} for {damage}.",
  "log.characterTrashed": "{card} is K.O.'d.",
  "log.negated": "{card} is negated.",
  "log.lifeCost": "{actor} pays {amount} life.",
  "log.lifeGain": "{actor} gains {amount} life.",
  "log.chakraLocked": "{actor}'s chakra recovery is locked.",
  "log.koAll": "{card} K.O.s all characters!",
  "log.koTarget": "{card} K.O.s {target}.",
  "log.bounce": "{card} returns {target} to its owner's hand.",
  "log.powerDoubled": "{card}'s power is doubled.",
  "log.supportImmune": "{card} is immune to opposing support effects.",
  "log.leaderBoost": "{actor}'s leader empowers {card}.",
  "log.leaderDig": "{actor}'s leader searches the deck.",
  "log.teamBoost": "{card} boosts the team.",
  "log.reveal": "{actor} reveals {card}.",
  "log.revealNoMatch": "{actor} reveals {card} - no match.",
  "log.frozen": "{card} cannot attack next turn.",
  "log.recovery": "{actor} rests their leader and recovers all chakra.",
  "log.choiceCancelled": "{actor} cancels the effect.",
  "log.victory": "{actor} wins the game!",
};

/** Log keys rendered as nested effect lines under their trigger. */
export const EFFECT_LOG_KEYS: ReadonlySet<string> = new Set([
  "log.summonFromTrash",
  "log.summonNegated",
  "log.summonRequirementPaid",
  "log.attackInterrupted",
  "log.hitLeader",
  "log.hitCharacter",
  "log.characterTrashed",
  "log.negated",
  "log.lifeCost",
  "log.lifeGain",
  "log.chakraLocked",
  "log.koAll",
  "log.koTarget",
  "log.bounce",
  "log.powerDoubled",
  "log.supportImmune",
  "log.leaderBoost",
  "log.leaderDig",
  "log.teamBoost",
  "log.reveal",
  "log.revealNoMatch",
  "log.frozen",
]);

function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => values[name]?.toString() ?? match);
}

export function logEntryText(entry: LogEntry, actorNames: { p1: string; p2: string }): string {
  const template = LOG_TEMPLATES[entry.key] ?? entry.key;
  const values: Record<string, string | number> = { ...entry.values };
  values.actor =
    entry.actor === "system" ? "System" : entry.actor === "p1" ? actorNames.p1 : actorNames.p2;
  values.turn = entry.turn;
  return interpolate(template, values);
}

export function isEffectLogKey(key: string): boolean {
  return EFFECT_LOG_KEYS.has(key);
}

const CHOICE_PROMPTS: Record<string, string> = {
  "choice.exRequirement": "Choose a character to place in your trash as a summon requirement.",
  "choice.freezeTarget": "Choose a character - it cannot attack next turn.",
  "choice.reviveFromTrash": "Choose a character in your trash to summon.",
  "choice.koTarget": "Choose a character to K.O.",
  "choice.searchSummon": "Choose a character from your deck to summon.",
  "choice.leaderBoost": "Choose a character to empower.",
  "choice.leaderPutBack": "Choose a card in your hand to put back.",
  "choice.doublePower": "Choose a character - its power is doubled this turn.",
  "choice.supportImmune": "Choose a character to shield from support effects.",
  "choice.bounceTarget": "Choose a character to return to its owner's hand.",
};

export function choicePromptText(promptKey: string): string {
  return CHOICE_PROMPTS[promptKey] ?? promptKey;
}

const BLOCK_REASON_TEXT: Record<BlockReason, string> = {
  noChakra: "Not enough face-up chakra",
  alreadyUsed: "Already used this turn",
  conditionUnmet: "Condition not met",
  timing: "Not legal right now",
  noTarget: "No legal target",
  noSlot: "No open slot",
  notYourTurn: "Not your turn",
  tooEarly: "Too early in the game",
  rested: "Rested",
  summoningSickness: "Summoned this turn",
  noAttackLeft: "No attacks left",
  frozen: "Cannot attack yet",
};

export function blockReasonText(reason: string | null): string | null {
  if (!reason) return null;
  return (BLOCK_REASON_TEXT as Record<string, string>)[reason] ?? reason;
}

export function phaseLabel(phase: Phase, step: Step): string {
  if (step === "counter") return "Counter step";
  switch (phase) {
    case "refresh":
      return "Refresh";
    case "draw":
      return "Draw";
    case "main":
      return "Main phase";
    case "end":
      return "End phase";
  }
}

const DECK_ISSUE_TEXT: Record<DeckIssue, string> = {
  noLeader: "No leader selected",
  unknownLeader: "Leader is not a valid leader card",
  wrongSize: "Deck must contain exactly 50 cards",
  notACharacter: "Deck contains a card that is not a character or EX character",
  wrongColor: "Deck contains a card whose color does not match the leader",
  tooManyCopies: "Deck contains more than 4 copies of a card",
};

export function deckIssueText(issue: DeckIssue): string {
  return DECK_ISSUE_TEXT[issue] ?? issue;
}

export function supportTimingLabel(timing: string | undefined): string {
  const value = (timing ?? "").toLowerCase();
  if (value.includes("quick")) return "Quick";
  if (value.includes("opponent")) return "Counter";
  if (value.includes("support activated")) return "Response";
  if (value.includes("main")) return "Main";
  return timing ?? "";
}
