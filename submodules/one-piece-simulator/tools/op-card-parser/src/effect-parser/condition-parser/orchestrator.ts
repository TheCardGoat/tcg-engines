import type { Condition, EffectTrigger } from "@tcg/op-types";
import type { InlineConditionResult } from "../types.ts";
import { parseLeaderCondition } from "./leader.ts";
import { parseCountCondition } from "./counts.ts";
import { parseCardStateCondition } from "./card-state.ts";
import { parseReplacementCondition, parseNonSelfReplacementCondition } from "./replacement.ts";

/**
 * Extract an "If <condition>, <actions>" or "When <event>, <actions>" prefix
 * from action text.
 * Returns the parsed condition and remaining action text, or null if
 * no "If"/"When" prefix is present or the condition can't be parsed.
 */
export function parseInlineCondition(text: string): InlineConditionResult | null {
  // "This effect can be activated when X. Y" — meta-prefix for custom timing
  const activatedWhenMatch =
    /^This\s+effect\s+can\s+be\s+activated\s+when\s+(.+?)\.\s+(.+)$/is.exec(text);
  if (activatedWhenMatch) {
    const eventText = activatedWhenMatch[1]!;
    let remaining = activatedWhenMatch[2]!;
    // Try parsing as a known event trigger
    const event = parseWhenEvent(eventText);
    // If remaining still starts with "If X, ..." or "You may ...", strip it for the action text
    const nestedIf = /^If\s+.+?,\s+/i.exec(remaining);
    if (nestedIf) {
      remaining = remaining.slice(nestedIf[0].length).trim();
    }
    remaining = remaining.replace(/^You\s+may\s+/i, "").trim();
    if (event) {
      return { condition: { condition: "triggerEvent", event }, remainingText: remaining };
    }
    // Try as a custom condition — "this Character is rested by your opponent's effect"
    const cond = parseConditionText(eventText);
    if (cond) {
      return { condition: cond, remainingText: remaining };
    }
  }

  // "If X, Y" — try splitting at different comma positions to handle conditions with internal commas
  if (/^If\s+/i.test(text)) {
    const afterIf = text.slice(text.indexOf(" ") + 1);
    // Find all comma positions and try from longest to shortest condition text
    const commaPositions: number[] = [];
    for (let i = 0; i < afterIf.length; i++) {
      if (afterIf[i] === ",") commaPositions.push(i);
    }
    // Try longest condition first (rightmost comma), then shorter
    for (let ci = commaPositions.length - 1; ci >= 0; ci--) {
      const condText = afterIf.slice(0, commaPositions[ci]!).trim();
      let remaining = afterIf.slice(commaPositions[ci]! + 1).trim();
      const condition = parseConditionText(condText);
      if (condition) {
        // Check for compound condition: "and <condition2>, <action>"
        const andCondMatch = /^and\s+(.+?),\s+(.+)$/is.exec(remaining);
        if (andCondMatch) {
          const cond2 = parseConditionText(andCondMatch[1]!);
          if (cond2) {
            remaining = andCondMatch[2]!;
            return {
              condition: { condition: "compound", operator: "and", conditions: [condition, cond2] },
              remainingText: remaining,
            };
          }
        }
        return { condition, remainingText: remaining };
      }
    }
  }

  // "When X, Y" — event prefix
  const whenMatch = /^When\s+(.+?),\s+(.+)$/is.exec(text);
  if (whenMatch) {
    const eventText = whenMatch[1]!;
    let remaining = whenMatch[2]!;
    const event = parseWhenEvent(eventText);
    if (!event) return null;
    // Handle nested "if Y, Z" after the event — strip condition prefix
    const nestedIf = /^if\s+.+?,\s+/i.exec(remaining);
    if (nestedIf) {
      remaining = remaining.slice(nestedIf[0].length).trim();
      remaining = remaining.replace(/^you\s+may\s+/i, "").trim();
    }
    return { condition: { condition: "triggerEvent", event }, remainingText: remaining };
  }

  // "At the end of a battle in which X, Y" — battle-end condition
  const atEndMatch = /^At\s+the\s+end\s+of\s+(.+?),\s+(.+)$/is.exec(text);
  if (atEndMatch) {
    const cond = parseConditionText(atEndMatch[1]!);
    if (cond) {
      return { condition: cond, remainingText: atEndMatch[2]! };
    }
  }

  // "ACTION when EVENT" — event suffix (e.g., "Draw 1 card when your opponent activates an Event")
  const whenSuffix = /^(.+?)\s+when\s+(.+)$/is.exec(text);
  if (whenSuffix) {
    const remaining = whenSuffix[1]!;
    const eventText = whenSuffix[2]!;
    const event = parseWhenEvent(eventText);
    if (!event) return null;
    return { condition: { condition: "triggerEvent", event }, remainingText: remaining };
  }

  return null;
}

/**
 * Map "When X" event text to an EffectTrigger value.
 */
export function parseWhenEvent(text: string): EffectTrigger | null {
  const t = text.trim().replace(/\.+$/, "");

  // "this Character/Leader's attack deals damage to your opponent's Life"
  if (
    /^this\s+(?:Character|Leader)[''\u2019]s\s+attack\s+deals\s+damage\s+to\s+your\s+opponent[''\u2019]s\s+Life$/i.test(
      t,
    )
  )
    return "whenDealsDamage";

  // "this Character battles and K.O.'s your opponent's Character"
  if (
    /^this\s+Character\s+battles\s+and\s+K\.O\.\u2019?'?s\s+your\s+opponent[''\u2019]s\s+Character$/i.test(
      t,
    )
  )
    return "whenCharacterKod";

  // "this Character is K.O.'d (by your opponent's effect)?"
  if (
    /^this\s+Character\s+is\s+K\.O\.\u2019?'?d(?:\s+by\s+your\s+opponent[''\u2019]s\s+effect)?$/i.test(
      t,
    )
  )
    return "onKo";

  // "a DON!! card on your field is returned to your DON!! deck" (with or without "by your effect")
  if (
    /^a\s+DON!!\s+card\s+on\s+your\s+field\s+is\s+returned\s+to\s+your\s+DON!!\s+deck(?:\s+by\s+your\s+effect)?$/i.test(
      t,
    )
  )
    return "whenDonReturned";

  // "you/your opponent activates an Event (or [Trigger])?"
  if (/^your\s+opponent\s+activates\s+an\s+Event(?:\s+or\s+\[Trigger\])?$/i.test(t))
    return "whenOpponentActivatesEvent";
  if (/^you\s+activate\s+an\s+Event$/i.test(t)) return "whenOpponentActivatesEvent"; // reuse trigger type

  // "your opponent activates [Blocker] or an Event"
  if (/^your\s+opponent\s+activates\s+\[Blocker\]\s+or\s+an\s+Event$/i.test(t))
    return "whenBlockerActivated";

  // "a card is removed from your or your opponent's Life cards"
  if (
    /^a\s+card\s+is\s+removed\s+from\s+(?:your\s+or\s+your\s+opponent[''\u2019]s|your)\s+Life\s+cards?$/i.test(
      t,
    )
  )
    return "whenDealsDamage";

  // "your opponent plays a Character with a base cost of N or more" (with optional "or when..." compound)
  if (/^your\s+opponent\s+plays\s+a\s+Character/i.test(t)) return "onPlay";

  // "your opponent's Character is returned to the owner's hand by your effect"
  if (
    /^your\s+opponent[''\u2019]s\s+Character\s+is\s+returned\s+to\s+the\s+owner[''\u2019]s\s+hand\s+by\s+your\s+effect$/i.test(
      t,
    )
  )
    return "whenLeaving";

  // "one of your {Trait} type Characters ... is K.O.'d"
  if (/^one\s+of\s+your\s+.+\s+is\s+K\.O\.\u2019?'?d$/i.test(t)) return "onKo";

  // "a Character is K.O.'d" / "your opponent's Character is K.O.'d"
  if (
    /^(?:your\s+opponent[''\u2019]s\s+)?(?:a\s+)?Character\s+(?:on\s+your\s+opponent[''\u2019]s\s+field\s+)?is\s+K\.O\.\u2019?'?d$/i.test(
      t,
    )
  )
    return "whenCharacterKod";

  // "a Character is removed from the field by your/your opponent's effect"
  if (
    /^a\s+Character\s+is\s+removed\s+from\s+the\s+field(?:\s+by\s+(?:your|your\s+opponent[''\u2019]s)\s+effect)?$/i.test(
      t,
    )
  )
    return "whenLeaving";

  // "a [Trigger] activates"
  if (/^a\s+\[Trigger\]\s+activates$/i.test(t)) return "whenTriggerActivates";

  // "you play a Character with a [Trigger]"
  if (/^you\s+play\s+a\s+Character\s+with\s+a\s+\[Trigger\]$/i.test(t))
    return "whenTriggerActivates";

  // "your opponent activates [Blocker]" / "a [Blocker] is activated" / "your opponent activates [Blocker] or an Event"
  if (
    /^(?:your\s+opponent\s+activates\s+(?:a\s+)?\[Blocker\](?:\s+or\s+an\s+Event)?|a\s+\[Blocker\]\s+is\s+activated)$/i.test(
      t,
    )
  )
    return "whenBlockerActivated";

  // "your opponent attacks"
  if (/^your\s+opponent\s+attacks$/i.test(t)) return "onOpponentAttack";

  // "this Leader or 1 of your Characters is given a DON!! card"
  if (
    /^(?:this\s+Leader\s+or\s+)?\d+\s+of\s+your\s+Characters?\s+is\s+given\s+a\s+DON!!\s+card$/i.test(
      t,
    )
  )
    return "whenDonReturned"; // Reuse closest trigger type

  // "you play a Character (with X) from your hand"
  if (/^you\s+play\s+a\s+Character\b/i.test(t)) return "onPlay";

  // "you activate an Event"
  if (/^you\s+activate\s+an\s+Event$/i.test(t)) return "whenOpponentActivatesEvent"; // Reuse

  // "you draw a card outside of your Draw Phase"
  if (/^you\s+draw\s+a\s+card\s+outside\s+of\s+your\s+Draw\s+Phase$/i.test(t))
    return "whenDealsDamage"; // Reuse

  // "a card is added to your hand from your Life"
  if (/^a\s+card\s+is\s+added\s+to\s+your\s+hand\s+from\s+your\s+Life$/i.test(t))
    return "whenDealsDamage"; // Reuse

  // "N or more DON!! cards on your field are returned to your DON!! deck"
  if (
    /^\d+\s+or\s+more\s+DON!!\s+cards?\s+on\s+your\s+field\s+are\s+returned\s+to\s+your\s+DON!!\s+deck$/i.test(
      t,
    )
  )
    return "whenDonReturned";

  // "a Character is rested by your effect"
  if (/^a\s+Character\s+is\s+rested\s+by\s+your\s+effect$/i.test(t)) return "whenLeaving"; // Reuse

  // "your X type Character is removed from the field by your opponent's effect"
  if (
    /^your\s+.+?\s+type\s+Character\s+is\s+removed\s+from\s+the\s+field\s+by\s+your\s+opponent[''\u2019]s\s+effect$/i.test(
      t,
    )
  )
    return "whenLeaving";

  // "your opponent's Character attacks"
  if (/^your\s+opponent[''\u2019]s\s+Character\s+attacks$/i.test(t)) return "onOpponentAttack";

  // "you take damage (or ...)"
  if (/^you\s+take\s+damage/i.test(t)) return "whenDealsDamage";

  // "this Character becomes rested"
  if (/^this\s+Character\s+becomes\s+rested$/i.test(t)) return "whenLeaving"; // Reuse

  return null;
}

/**
 * Parse a condition clause into a typed `Condition`.
 * Tries single-condition parsing first, then compound "and" splitting.
 */
export function parseConditionText(text: string): Condition | null {
  const single = parseSingleCondition(text);
  if (single) return single;

  // Compound "and": split on " and " followed by condition-starting words
  const compound = parseCompoundCondition(text);
  if (compound) return compound;

  // Non-self replacement: tried last because its greedy regex can match compound texts
  return parseNonSelfReplacementCondition(text);
}

/**
 * Parse a single (non-compound) condition clause.
 */
function parseSingleCondition(text: string): Condition | null {
  return (
    parseLeaderCondition(text) ??
    parseCountCondition(text) ??
    parseCardStateCondition(text) ??
    parseReplacementCondition(text)
  );
}

function parseCompoundCondition(text: string): Condition | null {
  // Split on " and " followed by condition-starting words
  const splitPattern = /\s+and\s+(?=(?:you(?:r|\s)|this\s|the\s+number|there\s|is\s))/i;
  const parts = text.split(splitPattern);
  if (parts.length < 2) return null;

  const conditions: Condition[] = [];
  for (const part of parts) {
    const cond = parseSingleCondition(part.trim());
    if (!cond) return null; // All parts must parse
    conditions.push(cond);
  }

  return { condition: "compound", operator: "and", conditions };
}
