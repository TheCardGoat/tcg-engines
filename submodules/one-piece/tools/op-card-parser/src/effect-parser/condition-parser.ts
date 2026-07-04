import type { Condition, EffectTrigger, Zone } from "@tcg/op-types";
import type { InlineConditionResult } from "./types.ts";
import { parseComparison } from "./helpers.ts";

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
  return parseNonSelfReplacement(text);
}

/**
 * Parse a single (non-compound) condition clause.
 */
function parseSingleCondition(text: string): Condition | null {
  const t = text.trim();
  let m: RegExpExecArray | null;

  // Leader trait (multi): your Leader has the {X} or {Y} type
  m = /^your Leader has the [""[{]([^""\]}]+)[""\]}]\s+or\s+[""[{]([^""\]}]+)[""\]}]\s+type$/i.exec(
    t,
  );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: m[1]! },
        { condition: "leaderTrait", trait: m[2]! },
      ],
    };
  }

  // Leader trait (compound): your Leader has the {X} type or a type including "Y"
  m =
    /^your Leader has the [""[{]([^""\]}]+)[""\]}]\s+type\s+or\s+a\s+type\s+including\s+[""]([^""]+)[""]$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: m[1]! },
        { condition: "leaderTrait", trait: m[2]! },
      ],
    };
  }

  // Leader trait: your Leader has the "X" / [X] / {X} type
  m = /^your Leader has the [""[{]([^""\]}]+)[""\]}]\s+type$/i.exec(t);
  if (m) return { condition: "leaderTrait", trait: m[1]! };

  // Leader trait: your Leader's type includes "X"
  m = /^your Leader's type includes [""]([^""]+)[""]$/i.exec(t);
  if (m) return { condition: "leaderTrait", trait: m[1]! };

  // Leader name (multi): your Leader is [X], [Y] or [Z]
  m = /^your\s+Leader\s+is\s+(\[.+?\](?:,\s*\[.+?\])*\s+or\s+\[.+?\])$/i.exec(t);
  if (m) {
    const namesText = m[1]!;
    const names = [...namesText.matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]!);
    if (names.length > 1) {
      return {
        condition: "compound",
        operator: "or",
        conditions: names.map((name) => ({ condition: "leaderName" as const, name })),
      };
    }
  }

  // Leader name or multicolored: "your Leader is [X] or multicolored"
  m = /^your\s+Leader\s+is\s+\[([^\]]+)\]\s+or\s+multicolored$/i.exec(t);
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [{ condition: "leaderName", name: m[1]! }, { condition: "leaderMulticolored" }],
    };
  }

  // Leader name: your Leader is [X] or "X"
  m = /^your Leader is (?:\[([^\]]+)\]|[""]([^""]+)[""])$/i.exec(t);
  if (m) return { condition: "leaderName", name: (m[1] ?? m[2])! };

  // CardState (power): this/your Character/Leader has N power or more/less
  m = /^(?:this|your) (?:Character|Leader) has (\d+) power(?:\s+or\s+(more|less))?$/i.exec(t);
  if (m) {
    return {
      condition: "cardState",
      target: "this",
      property: "power",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // CardState (state): this Character/Leader/Stage is active/rested
  m = /^this (?:Character|Leader|Stage) is (active|rested)$/i.exec(t);
  if (m) {
    return {
      condition: "cardState",
      target: "this",
      property: "state",
      comparison: "eq",
      value: m[1]!.toLowerCase() as "rested" | "active",
    };
  }

  // Life count: you/your opponent have/has N or less/more Life cards
  m = /^(your opponent|you)\s+ha(?:ve|s)\s+(\d+)\s+or\s+(less|more)\s+Life\s+cards?$/i.exec(t);
  if (m) {
    return {
      condition: "lifeCount",
      player: m[1]!.toLowerCase() === "you" ? "self" : "opponent",
      comparison: parseComparison(m[3]),
      value: parseInt(m[2]!, 10),
    };
  }

  // Hand count: you have N or less/more cards in your hand
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+hand$/i.exec(t);
  if (m) {
    return {
      condition: "handCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Hand count (exact): you have N cards in your hand
  m = /^you\s+have\s+(\d+)\s+cards?\s+in\s+your\s+hand$/i.exec(t);
  if (m) {
    return {
      condition: "handCount",
      player: "self",
      comparison: "eq",
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (rested characters): you have N or more rested Characters
  // Must be before generic characters to avoid shadowing
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+rested\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "state", value: "rested" as const }],
    };
  }

  // Zone count (characters on field): you have N or more Characters
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (exact characters): you have N Characters
  m = /^you\s+have\s+(\d+)\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: "eq",
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (rested typed characters): you have N or more rested "X" type Characters
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+rested\s+[""[{]([^""\]}]+)[""\]}]\s+type\s+Characters$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [
        { filter: "state", value: "rested" as const },
        { filter: "trait", value: m[3]! },
      ],
    };
  }

  // Zone count (typed characters): you have N or more/less "X" type Characters
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+[""[{]([^""\]}]+)[""\]}]\s+type\s+Characters$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "trait", value: m[3]! }],
    };
  }

  // Zone count (typed trash): you have N or more Events/Characters in your trash
  const cardTypeMap: Record<string, "event" | "character" | "stage"> = {
    event: "event",
    events: "event",
    character: "character",
    characters: "character",
    stage: "stage",
    stages: "stage",
  };
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+(Events?|Characters?|Stages?)\s+in\s+your\s+trash$/i.exec(
      t,
    );
  if (m) {
    const cardType = cardTypeMap[m[3]!.toLowerCase()];
    if (cardType) {
      return {
        condition: "zoneCount",
        player: "self",
        zone: "trash",
        comparison: parseComparison(m[2]),
        value: parseInt(m[1]!, 10),
        filters: [{ filter: "cardCategory", value: cardType }],
      };
    }
  }

  // Zone count (trash): you have N or more cards in your trash
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+trash$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "trash",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (deck): you have N or less/more cards in your deck
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+deck$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "deck",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent hand count: your opponent has N or more/less cards in their hand
  m = /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+their\s+hand$/i.exec(t);
  if (m) {
    return {
      condition: "handCount",
      player: "opponent",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Compound DON!! field count: you have 0 or N or more DON!! cards on your field
  m =
    /^you\s+have\s+(\d+)\s+or\s+(\d+)\s+or\s+(less|more)\s+DON!!\s+cards?\s+on\s+your\s+field$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        {
          condition: "donFieldCount",
          player: "self",
          comparison: "eq",
          value: parseInt(m[1]!, 10),
        },
        {
          condition: "donFieldCount",
          player: "self",
          comparison: parseComparison(m[3]),
          value: parseInt(m[2]!, 10),
        },
      ],
    };
  }

  // DON!! field count: you have N or more/less DON!! cards on your field
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+DON!!\s+cards?\s+on\s+your\s+field$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // DON!! field count (exact): you have N DON!! cards on your field
  m = /^you\s+have\s+(\d+)\s+DON!!\s+cards?\s+on\s+your\s+field$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: "eq",
      value: parseInt(m[1]!, 10),
    };
  }

  // DON!! field count (active): you have N or more active DON!! cards
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+active\s+DON!!\s+cards?$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent DON!! field count: your opponent has N or more/less DON!! cards on their field
  m =
    /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+DON!!\s+cards?\s+on\s+their\s+field$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "donFieldCount",
      player: "opponent",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent rested cards/Characters: your opponent has N or more rested cards/Characters
  m = /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+rested\s+(cards?|Characters?)$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "opponent",
      zone: /^Characters?$/i.test(m[3]!) ? "character" : "field",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "state", value: "rested" as const }],
    };
  }

  // DON!! field comparison: the number of DON!! cards on your field is equal to or less than the number on your opponent's field
  m =
    /^the\s+number\s+of\s+DON!!\s+cards?\s+on\s+your\s+field\s+is\s+equal\s+to\s+or\s+(less|more)\s+than\s+the\s+number\s+on\s+your\s+opponent's\s+field$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "donFieldComparison",
      selfComparison: parseComparison(m[1]),
    };
  }

  // DON!! field comparison: your opponent has more DON!! cards on their field than you
  m =
    /^your\s+opponent\s+has\s+(more|less)\s+DON!!\s+cards?\s+on\s+their\s+field\s+than\s+you$/i.exec(
      t,
    );
  if (m) {
    // "opponent has more" means self has less
    const oppComp = m[1]!.toLowerCase();
    return {
      condition: "donFieldComparison",
      selfComparison: oppComp === "more" ? "lt" : "gt",
    };
  }

  // Compound life count: you and your opponent have a total of N or less Life cards
  m =
    /^you\s+and\s+your\s+opponent\s+have\s+a\s+total\s+of\s+(\d+)\s+or\s+(less|more)\s+Life\s+cards?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "lifeCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Life comparison: you have less/more life cards than your opponent
  m = /^you\s+have\s+(less|more|fewer)\s+life\s+cards?\s+than\s+your\s+opponent$/i.exec(t);
  if (m) {
    const comp = m[1]!.toLowerCase();
    return {
      condition: "lifeComparison",
      selfComparison: comp === "more" ? "gt" : "lt",
    };
  }

  // Life comparison: the number of your life cards is equal to or less/more than your opponent's
  m =
    /^the\s+number\s+of\s+your\s+life\s+cards?\s+is\s+equal\s+to\s+or\s+(less|more)\s+than\s+(?:the\s+number\s+of\s+)?your\s+opponent's(?:\s+life\s+cards?)?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "lifeComparison",
      selfComparison: parseComparison(m[1]),
    };
  }

  // Leader multicolored: your Leader is multicolored
  m = /^your\s+Leader\s+is\s+multicolored$/i.exec(t);
  if (m) {
    return { condition: "leaderMulticolored" };
  }

  // DON!! given: you have any DON!! cards given
  m = /^you\s+have\s+any\s+DON!!\s+cards?\s+given$/i.exec(t);
  if (m) {
    return { condition: "donGiven", player: "self" };
  }

  // Has card: you/your opponent have/has a Character with a cost of N (or more/less)
  m =
    /^(you|your\s+opponent)\s+ha(?:ve|s)\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const player = /^you$/i.test(m[1]!) ? "self" : "opponent";
    const value = parseInt(m[2]!, 10);
    const comparison = m[3] ? parseComparison(m[3]) : "eq";
    return {
      condition: "hasCard",
      player,
      zone: "character",
      filters: [{ filter: "cost", comparison, value }],
    };
  }

  // Has card with name: you have a [X] Character
  m = /^you\s+have\s+a\s+\[([^\]]+)\]\s+Character$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Has card: your opponent has a Leader or Character with a base power of N or more/less
  m =
    /^your\s+opponent\s+has\s+a\s+(?:Leader\s+or\s+)?Character\s+with\s+a\s+base\s+power\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const value = parseInt(m[1]!, 10);
    const comparison = m[2] ? parseComparison(m[2]) : "eq";
    return {
      condition: "hasCard",
      player: "opponent",
      zone: "character",
      filters: [{ filter: "basePower", comparison, value }],
    };
  }

  // Opponent has Character with a cost of N (or more/less)
  m =
    /^your\s+opponent\s+has\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const value = parseInt(m[1]!, 10);
    const comparison = m[2] ? parseComparison(m[2]) : "eq";
    return {
      condition: "hasCard",
      player: "opponent",
      zone: "character",
      filters: [{ filter: "cost", comparison, value }],
    };
  }

  // Played this turn: this Character was/has played on this turn
  m = /^this\s+Character\s+(?:was|has)\s+played\s+on\s+this\s+turn$/i.exec(t);
  if (m) return { condition: "playedThisTurn" };

  // Face-up life: you have a face-up Life card
  m = /^you\s+have\s+a\s+face-up\s+Life\s+card$/i.exec(t);
  if (m) return { condition: "faceUpLife", player: "self" };

  // Exists on field: compound — "there is a Character with a cost of 0 or with a cost of 8 or more"
  m =
    /^there\s+is\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)\s+or\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        {
          condition: "existsOnField",
          zone: "character" as Zone,
          filters: [
            { filter: "cost" as const, comparison: "eq" as const, value: parseInt(m[1]!, 10) },
          ],
        },
        {
          condition: "existsOnField",
          zone: "character" as Zone,
          filters: [
            {
              filter: "cost" as const,
              comparison: m[3] ? parseComparison(m[3]) : ("eq" as const),
              value: parseInt(m[2]!, 10),
            },
          ],
        },
      ],
    };
  }

  // Exists on field: there is a Character with a cost of N (or more/less)
  m = /^there\s+is\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
    t,
  );
  if (m) {
    return {
      condition: "existsOnField",
      zone: "character",
      filters: [
        {
          filter: "cost",
          comparison: m[2] ? parseComparison(m[2]) : ("eq" as const),
          value: parseInt(m[1]!, 10),
        },
      ],
    };
  }

  // Exists on field: there is a Character with N power or more/less
  m = /^there\s+is\s+a\s+Character\s+with\s+(\d+)\s+power\s+or\s+(more|less)$/i.exec(t);
  if (m) {
    return {
      condition: "existsOnField",
      zone: "character",
      filters: [{ filter: "power", comparison: parseComparison(m[2]), value: parseInt(m[1]!, 10) }],
    };
  }

  // Replacement: this Character would be K.O.'d or would be removed (compound replacement)
  m =
    /^this\s+Character\s+would\s+be\s+K\.O\.\u2019?'?d\s+or\s+would\s+be\s+removed\s+from\s+the\s+field(?:\s+(.+))?$/i.exec(
      t,
    );
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "replacement", event: "ko", targetSelf: true },
        {
          condition: "replacement",
          event: "removed",
          targetSelf: true,
          ...(source && { source }),
        },
      ],
    };
  }

  // Replacement: this Character would be removed ... or K.O.'d
  m =
    /^this\s+Character\s+would\s+be\s+removed\s+from\s+the\s+field(?:\s+by\s+your\s+opponent's\s+effect)?\s+or\s+K\.O\.\u2019?'?d$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "replacement", event: "removed", targetSelf: true, source: "opponentEffect" },
        { condition: "replacement", event: "ko", targetSelf: true },
      ],
    };
  }

  // Replacement (self): this Character would be K.O.'d [by ...]
  m = /^this\s+Character\s+would\s+be\s+K\.O\.\u2019?'?d(?:\s+(.+))?$/i.exec(t);
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "replacement",
      event: "ko",
      targetSelf: true,
      ...(source && { source }),
    };
  }

  // Replacement (self): this Character would be removed from the field [by ...]
  m = /^this\s+Character\s+would\s+be\s+removed\s+from\s+the\s+field(?:\s+(.+))?$/i.exec(t);
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "replacement",
      event: "removed",
      targetSelf: true,
      ...(source && { source }),
    };
  }

  // Replacement (self): this Character would be rested [by ...]
  m = /^this\s+Character\s+would\s+be\s+rested(?:\s+(.+))?$/i.exec(t);
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "replacement",
      event: "rested",
      targetSelf: true,
      ...(source && { source }),
    };
  }

  // Replacement (self): this Character would leave the field
  m = /^this\s+Character\s+would\s+leave\s+the\s+field$/i.exec(t);
  if (m) return { condition: "replacement", event: "leave", targetSelf: true };

  // Has card by name: you have [X] (without "a" or "Character" after)
  m = /^you\s+have\s+\[([^\]]+)\]$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "field",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Not has card by name: you don't have [X]
  m = /^you\s+don[''\u2019]t\s+have\s+\[([^\]]+)\]$/i.exec(t);
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: "field",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Not has card by name with cost: you have no other [X] with a base cost of N
  m =
    /^you\s+have\s+no\s+other\s+\[([^\]]+)\](?:\s+Characters?)?\s+with\s+a\s+base\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: "field",
      filters: [
        { filter: "name", value: m[1]! },
        {
          filter: "baseCost",
          comparison: m[3] ? parseComparison(m[3]) : ("eq" as const),
          value: parseInt(m[2]!, 10),
        },
      ],
    };
  }

  // Not has card by name: you have no other [X] (Characters)? or you don't have [X]
  m = /^you\s+have\s+no\s+other\s+\[([^\]]+)\](?:\s+Characters?)?$/i.exec(t);
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: /Characters?$/i.test(t) ? "character" : "field",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Leader multi-trait: your Leader has the [X] or [X] type / {X} or {X} type
  m =
    /^your\s+Leader\s+has\s+the\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+or\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: m[1]! },
        { condition: "leaderTrait", trait: m[2]! },
      ],
    };
  }

  // Zone count with trait filter: you have N or more {Trait}/{[Trait]} type Characters (on your field)?
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?(?:\s+on\s+your\s+field)?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "trait", value: m[3]! }],
    };
  }

  // Zone count with multi-trait filter: you have N or more [X] or [Y] type Characters on your field
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+or\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?(?:\s+on\s+your\s+field)?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [
        { filter: "trait", value: m[3]! },
        { filter: "trait", value: m[4]! },
      ],
    };
  }

  // Opponent zone count (characters): your opponent has N or more Characters
  m = /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "opponent",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent has N or more Characters with a base power of N or more
  m =
    /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+Characters?\s+with\s+a\s+base\s+power\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "opponent",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [
        {
          filter: "basePower",
          comparison: m[4] ? parseComparison(m[4]) : ("eq" as const),
          value: parseInt(m[3]!, 10),
        },
      ],
    };
  }

  // Only type on field: the only Characters on your field are [X] type Characters
  m =
    /^the\s+only\s+Characters?\s+on\s+your\s+field\s+are\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: "eq",
      value: 0,
      filters: [{ filter: "trait", value: m[1]!, negate: true }],
    };
  }

  // Has card (Characters with power): you have N or less Characters with N power or more
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+Characters?\s+with\s+(\d+)\s+power\s+or\s+(less|more)$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "power", comparison: parseComparison(m[4]), value: parseInt(m[3]!, 10) }],
    };
  }

  // Has card with trait: you have a {X} type Character (no cost filter)
  m = /^you\s+have\s+a\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character$/i.exec(
    t,
  );
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [{ filter: "trait", value: m[1]! }],
    };
  }

  // Has card with trait and power: you have a {X} type Character with N power or more/less
  m =
    /^you\s+have\s+a\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character\s+with\s+(\d+)\s+power\s+or\s+(more|less)$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "trait", value: m[1]! },
        { filter: "power", comparison: parseComparison(m[3]), value: parseInt(m[2]!, 10) },
      ],
    };
  }

  // Has card with power: you have a Character with N power or more/less
  m = /^you\s+have\s+a\s+Character\s+with\s+(\d+)\s+power\s+or\s+(more|less)$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [{ filter: "power", comparison: parseComparison(m[2]), value: parseInt(m[1]!, 10) }],
    };
  }

  // Has card with trait and cost: you have a {X} type Character with a cost of N (or more)
  m =
    /^you\s+have\s+a\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "trait", value: m[1]! },
        {
          filter: "cost",
          comparison: m[3] ? parseComparison(m[3]) : ("eq" as const),
          value: parseInt(m[2]!, 10),
        },
      ],
    };
  }

  // Has card with trait and specific name: you have a "X" type [Y]
  m =
    /^you\s+have\s+(?:\d+\s+or\s+(?:less|more)\s+)?(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?$/i.exec(
      t,
    );
  // (handled by zoneCount with trait filter above)

  // Not has card with base power: you have no Characters with N base power or more
  m = /^you\s+have\s+no\s+Characters?\s+with\s+(\d+)\s+base\s+power\s+or\s+(more|less)$/i.exec(t);
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "basePower", comparison: parseComparison(m[2]), value: parseInt(m[1]!, 10) },
      ],
    };
  }

  // CardState (rested/active): this Character is rested/active (without "and" compound)
  m = /^this\s+Character\s+is\s+(rested|active)$/i.exec(t);
  if (m) {
    return {
      condition: "cardState",
      target: "this",
      property: "state",
      comparison: "eq",
      value: m[1]!.toLowerCase() as "rested" | "active",
    };
  }

  // CannotBeKod in battle: this Character cannot be K.O.'d in battle
  m = /^this\s+Character\s+cannot\s+be\s+K\.O\.\u2019?'?d\s+in\s+battle$/i.exec(t);
  if (m) return null; // Handled as action, not condition — return null to let it fall through

  // Total cards in Life area and hand: "you have a total of N or less cards in your Life area and hand"
  m =
    /^you\s+have\s+a\s+total\s+of\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+Life\s+area\s+and\s+hand$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "and",
      conditions: [
        {
          condition: "lifeCount",
          player: "self",
          comparison: parseComparison(m[2]),
          value: parseInt(m[1]!, 10),
        },
        {
          condition: "handCount",
          player: "self",
          comparison: parseComparison(m[2]),
          value: parseInt(m[1]!, 10),
        },
      ],
    };
  }

  // Character count comparison: "the number of your Characters is at least N less than the number of your opponent's Characters"
  m =
    /^the\s+number\s+of\s+your\s+Characters\s+is\s+at\s+least\s+(\d+)\s+less\s+than\s+the\s+number\s+of\s+your\s+opponent[''\u2019]s\s+Characters$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCountComparison",
      zone: "character",
      selfComparison: "lt",
      difference: parseInt(m[1]!, 10),
    } as any;
  }

  // Attribute condition: "that Character has the (Attribute) attribute"
  m = /^that\s+Character\s+has\s+the\s+\(([^)]+)\)\s+attribute$/i.exec(t);
  if (m) {
    return {
      condition: "cardState",
      target: "opponent",
      property: "attribute",
      comparison: "eq",
      value: m[1]!.toLowerCase(),
    } as any;
  }

  // "this Character was played on this turn"
  m = /^this\s+Character\s+was\s+played\s+on\s+this\s+turn$/i.exec(t);
  if (m) return { condition: "playedThisTurn" };

  // Leader attribute: "your Leader has the (Attribute) attribute"
  m = /^your\s+Leader\s+has\s+the\s+\(([^)]+)\)\s+attribute$/i.exec(t);
  if (m) {
    return { condition: "leaderTrait", trait: m[1]!.toLowerCase() } as any;
  }

  // Leader color: "your Leader's colors include blue/red/..."
  m =
    /^your\s+Leader[''\u2019]s\s+colors?\s+includes?\s+(red|green|blue|purple|black|yellow)$/i.exec(
      t,
    );
  if (m) {
    return { condition: "leaderColor", color: m[1]!.toLowerCase() } as any;
  }

  // Event-like condition: "a Character is rested by your effect"
  m = /^a\s+Character\s+is\s+rested\s+by\s+your\s+effect$/i.exec(t);
  if (m) {
    return { condition: "triggerEvent", event: "whenLeaving" } as any;
  }

  // Total given DON!!: "you have a total of N or more given DON!! cards"
  m = /^you\s+have\s+a\s+total\s+of\s+(\d+)\s+or\s+(more|less)\s+given\s+DON!!\s+cards?$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // "this Leader/Character battles your opponent's Character (during this turn)?"
  m =
    /^this\s+(?:Leader|Character)\s+battles\s+your\s+opponent[''\u2019]s\s+Character(?:\s+(?:during\s+this\s+turn|with\s+.+))?$/i.exec(
      t,
    );
  if (m) {
    return { condition: "triggerEvent", event: "whenAttacking" } as any;
  }

  // "at the end of a battle in which this Character battles your opponent's Character with ..."
  m =
    /^at\s+the\s+end\s+of\s+a\s+battle\s+in\s+which\s+this\s+Character\s+battles\s+your\s+opponent[''\u2019]s\s+Character(?:\s+with\s+.+)?$/i.exec(
      t,
    );
  if (m) {
    return { condition: "triggerEvent", event: "whenAttacking" } as any;
  }

  // "a battle in which this Character battles your opponent's Character with ..."
  m =
    /^a\s+battle\s+in\s+which\s+this\s+Character\s+battles\s+your\s+opponent[''\u2019]s\s+Character(?:\s+with\s+.+)?$/i.exec(
      t,
    );
  if (m) {
    return { condition: "triggerEvent", event: "whenAttacking" } as any;
  }

  // "your Leader's type includes "X""
  m = /^your\s+Leader[''\u2019]s\s+type\s+includes?\s+[""\u201c]([^""\u201d]+)[""\u201d]$/i.exec(t);
  if (m) {
    return { condition: "leaderTrait", trait: m[1]! };
  }

  // "you have N or more cards in your trash"
  m = /^you\s+have\s+(\d+)\s+or\s+(more|less)\s+cards?\s+in\s+your\s+trash$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "trash",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  return null;
}

function parseReplacementEvent(text: string): "ko" | "removed" | "rested" {
  const lower = text.toLowerCase();
  if (lower.startsWith("k.o")) return "ko";
  if (lower.startsWith("removed")) return "removed";
  return "rested";
}

function parseReplacementSource(
  text?: string,
): "opponentEffect" | "opponentCharacterEffect" | "battle" | "effect" | undefined {
  if (!text) return undefined;
  const lower = text.trim().toLowerCase();
  if (/by\s+your\s+opponent's\s+character's\s+effect/.test(lower)) return "opponentCharacterEffect";
  if (/by\s+your\s+opponent's\s+effect/.test(lower)) return "opponentEffect";
  if (/in\s+battle/.test(lower)) return "battle";
  if (/by\s+an?\s+effect/.test(lower)) return "effect";
  return undefined;
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

/**
 * Non-self replacement conditions like "your rested Character would be K.O.'d".
 * Separated from parseSingleCondition because the greedy `.+` regex can
 * incorrectly match compound condition texts.
 */
function parseNonSelfReplacement(text: string): Condition | null {
  const t = text.trim();
  let m: RegExpExecArray | null;

  // your ... would be K.O.'d/removed/rested [by ...]
  m =
    /^your\s+.+\s+would\s+be\s+(K\.O\.\u2019?'?d|removed\s+from\s+the\s+field|rested)(?:\s+(.+))?$/i.exec(
      t,
    );
  if (m) {
    const event = parseReplacementEvent(m[1]!);
    const source = parseReplacementSource(m[2]);
    return {
      condition: "replacement",
      event,
      targetSelf: false,
      ...(source && { source }),
    };
  }

  // any of your Characters would be K.O.'d/removed [by ...]
  m =
    /^any\s+of\s+your\s+Characters?\s+would\s+be\s+(K\.O\.\u2019?'?d|removed\s+from\s+the\s+field|rested)(?:\s+(.+))?$/i.exec(
      t,
    );
  if (m) {
    const event = parseReplacementEvent(m[1]!);
    const source = parseReplacementSource(m[2]);
    return {
      condition: "replacement",
      event,
      targetSelf: false,
      ...(source && { source }),
    };
  }

  return null;
}
