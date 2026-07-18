import type { EffectTrigger } from "@tcg/op-types";
import type { ParsedCondition, ParsedEffectText, RawCost, RawEffectSegment } from "./types.ts";
import { KEYWORD_EXPLANATIONS, DON_REMINDERS, TRIGGER_BRACKET_RE } from "./constants.ts";
import {
  mapTrigger,
  isDonCondition,
  isTurnCondition,
  isOncePerTurn,
  isKeywordBracket,
  escapeRegex,
} from "./helpers.ts";

interface PrefixParseResult {
  triggers: EffectTrigger[];
  conditions: ParsedCondition[];
  oncePerTurn: boolean;
  costs: RawCost[];
  optional: boolean;
  actionText: string;
}

/**
 * Strip trailing errata notes from card text.
 */
function stripErrata(text: string): { cleaned: string; errata?: string } {
  const errataPattern = /\s*This card has been officially errata'?d\.?\s*$/i;
  const match = errataPattern.exec(text);
  if (match) {
    return { cleaned: text.slice(0, match.index).trim(), errata: match[0].trim() };
  }
  return { cleaned: text };
}

function stripFlavorParentheticals(text: string): string {
  let result = text;
  for (const pattern of KEYWORD_EXPLANATIONS) {
    result = result.replace(pattern, (match) => {
      // Keep the keyword bracket, remove just the parenthetical
      const keyBracketEnd = match.indexOf("]");
      if (keyBracketEnd >= 0) {
        return match.slice(0, keyBracketEnd + 1);
      }
      return match;
    });
  }
  for (const pattern of DON_REMINDERS) {
    result = result.replace(pattern, " ");
  }
  return result.replace(/\s{2,}/g, " ").trim();
}

/**
 * Split text into lines, handling both newlines and API data that concatenates
 * effects without newlines (e.g., `[Blocker](...)[On Play]...`).
 *
 * Also joins continuation lines (bullet items starting with `•`) with their
 * preceding "Choose one:" line.
 */
function splitIntoLines(text: string): string[] {
  // First split on newlines
  const rawLines = text.split("\n");
  const joined: string[] = [];

  // Join bullet continuation lines (•) with preceding line
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("•") && joined.length > 0) {
      // Continuation of a "Choose one:" pattern — append to previous line
      joined[joined.length - 1] += "\n" + trimmed;
    } else {
      joined.push(trimmed);
    }
  }

  const result: string[] = [];
  for (const line of joined) {
    // Secondary split: detect where `)` is followed by `[TriggerName]`
    // Only split at `)` → `[`, NOT at `]` → `[` (which is prefix chain continuation)
    const parts = secondarySplit(line);
    result.push(...parts);
  }

  return result;
}

/**
 * Further split a single line at positions where a closing `)` is
 * directly followed by `[` that starts a known trigger/condition bracket.
 *
 * Only splits at `)` → `[`, NOT at `]` → `[`. Adjacent brackets like
 * `[DON!! x1][Opponent's Turn]` are prefix chains and must not be split.
 */
function secondarySplit(line: string): string[] {
  const result: string[] = [];
  // Strip trailing Disclaimer text before splitting
  let remaining = line.replace(/\.?\s*Disclaimer:\s*This card was reprinted.*$/i, "");

  while (remaining.length > 0) {
    let splitIdx = -1;

    for (let i = 1; i < remaining.length; i++) {
      if (remaining[i] !== "[") continue;
      // Split at `)` or `.` followed by `[` (with optional whitespace) when it starts a known trigger/keyword bracket
      const prev = remaining.slice(0, i).trimEnd();
      const lastChar = prev[prev.length - 1];
      if (lastChar !== ")" && lastChar !== ".") continue;
      const afterBracket = remaining.slice(i);
      if (
        TRIGGER_BRACKET_RE.test(afterBracket) ||
        /^\[(Rush|Blocker|Double Attack|Banish|Unblockable)/i.test(afterBracket)
      ) {
        splitIdx = i;
        break;
      }
    }

    if (splitIdx === -1) {
      result.push(remaining.trim());
      break;
    }

    const before = remaining.slice(0, splitIdx).trim();
    if (before) result.push(before);
    remaining = remaining.slice(splitIdx);
  }

  return result;
}

/**
 * Check if a line starts with a recognized trigger, condition, or keyword bracket.
 * If not, it's a plain statement.
 */
function startsWithKnownBracket(line: string): boolean {
  const match = /^\[([^\]]+)\]/.exec(line);
  if (!match) return false;
  const content = match[1]!;
  return (
    mapTrigger(content) !== null ||
    isDonCondition(content) !== null ||
    isTurnCondition(content) !== null ||
    isOncePerTurn(content) ||
    isKeywordBracket(content)
  );
}

/**
 * Split a line at a period that ends a plain statement before a bracket.
 * E.g., "This Leader cannot attack. [Activate:Main] ..."
 */
function splitPlainPrefix(line: string): { plain?: string; rest: string } {
  // Look for ". [" pattern where what follows is a known bracket
  const pattern = /\.\s+(?=\[)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(line)) !== null) {
    const rest = line.slice(match.index + match[0].length);
    if (startsWithKnownBracket(rest)) {
      return {
        plain: line.slice(0, match.index + 1).trim(), // include the period
        rest: rest.trim(),
      };
    }
  }
  return { rest: line };
}

// ── Bracket prefix chain parser ──

/**
 * Parse the bracket prefix chain and cost area from a segment.
 */
function parsePrefixChain(segment: string): PrefixParseResult {
  const triggers: PrefixParseResult["triggers"] = [];
  const conditions: PrefixParseResult["conditions"] = [];
  let oncePerTurn = false;
  const costs: RawCost[] = [];
  let optional = false;

  let remaining = segment;

  // Check for dual trigger pattern first: [X] / [Y]
  const dualTriggerMatch = /^\[([^\]]+)\]\s*\/\s*\[([^\]]+)\]/.exec(remaining);
  if (dualTriggerMatch) {
    const t1 = mapTrigger(dualTriggerMatch[1]!);
    const t2 = mapTrigger(dualTriggerMatch[2]!);
    if (t1) triggers.push(t1);
    if (t2) triggers.push(t2);
    remaining = remaining.slice(dualTriggerMatch[0].length).trim();
  }

  // Consume bracket tokens left-to-right
  while (remaining.length > 0) {
    // Try bracket: [...]
    const bracketMatch = /^\[([^\]]+)\]\s*/.exec(remaining);
    if (bracketMatch) {
      const content = bracketMatch[1]!;

      // Check for dual trigger within the chain (after initial brackets)
      const dualAfter = new RegExp(`^\\[${escapeRegex(content)}\\]\\s*/\\s*\\[([^\\]]+)\\]`).exec(
        remaining,
      );
      if (dualAfter) {
        const t1 = mapTrigger(content);
        const t2 = mapTrigger(dualAfter[1]!);
        if (t1) triggers.push(t1);
        if (t2) triggers.push(t2);
        remaining = remaining.slice(dualAfter[0].length).trim();
        continue;
      }

      const trigger = mapTrigger(content);
      if (trigger) {
        triggers.push(trigger);
        remaining = remaining.slice(bracketMatch[0].length);
        continue;
      }

      const donCond = isDonCondition(content);
      if (donCond) {
        conditions.push(donCond);
        remaining = remaining.slice(bracketMatch[0].length);
        continue;
      }

      const turnCond = isTurnCondition(content);
      if (turnCond) {
        conditions.push(turnCond);
        remaining = remaining.slice(bracketMatch[0].length);
        continue;
      }

      if (isOncePerTurn(content)) {
        oncePerTurn = true;
        remaining = remaining.slice(bracketMatch[0].length);
        continue;
      }

      if (isKeywordBracket(content)) {
        // Skip keyword brackets — already handled by parseKeywords()
        remaining = remaining.slice(bracketMatch[0].length);
        continue;
      }

      // Unrecognized bracket — this is a card name reference or action text.
      // Stop consuming prefix brackets.
      break;
    }

    // Try DON!! return cost: DON!! -N or DON!! N (outside brackets)
    const donReturnMatch = /^DON!!\s*[-\u2212]?\s*(\d+)\s*/.exec(remaining);
    if (donReturnMatch) {
      costs.push({ type: "returnDon", amount: parseInt(donReturnMatch[1]!, 10) });
      remaining = remaining.slice(donReturnMatch[0].length);
      continue;
    }

    // Try DON!! rest cost: (N) — a number in parentheses
    const donRestMatch = /^\((\d+)\)\s*/.exec(remaining);
    if (donRestMatch) {
      costs.push({ type: "restDon", amount: parseInt(donRestMatch[1]!, 10) });
      remaining = remaining.slice(donRestMatch[0].length);
      continue;
    }

    // No more prefix tokens to consume
    break;
  }

  // Strip leading comma/space from cost-action separator (e.g., "DON!! 2, You may trash...")
  remaining = remaining.replace(/^[,\s]+/, "");

  // Now handle cost text before the colon separator. Most cards use
  // "You may <cost>:", but some spell the first payment imperatively before
  // joining a later optional payment (for example, "Rest 1 DON!! and you may
  // rest this Character:"). Accept either shape only when the prefix parses as
  // real costs, so ordinary action punctuation is not consumed as payment.
  const costColonMatch = /^(.+?):\s*/i.exec(remaining);
  const parsedColonCosts = costColonMatch ? parseTextCosts(costColonMatch[1]!) : [];
  if (costColonMatch && parsedColonCosts.some((cost) => cost.type !== "unknown")) {
    optional = /\byou\s+may\b/i.test(costColonMatch[1]!);
    costs.push(...parsedColonCosts.filter((cost) => cost.type !== "unknown"));
    remaining = remaining.slice(costColonMatch[0].length);
  } else {
    // Check for a bare colon that separates cost notation from action text
    // This happens after DON!! costs: "DON!! -5 (...): action"
    // The DON!! cost was already consumed above, so just strip the colon
    const bareColonMatch = /^:\s*/.exec(remaining);
    if (bareColonMatch && costs.length > 0) {
      remaining = remaining.slice(bareColonMatch[0].length);
    }
  }

  // Cost reminder text uses "You may", but is stripped before this point.
  // Costs are optional when a passive trigger offers the effect; direct
  // activations already represent the player's choice to pay their costs.
  const directActivationTriggers = new Set(["main", "counter", "trigger", "activateMain"]);
  const hasPassiveTrigger = triggers.some((trigger) => !directActivationTriggers.has(trigger));
  if (costs.length > 0 && hasPassiveTrigger) {
    optional = true;
  }

  return {
    triggers,
    conditions,
    oncePerTurn,
    costs,
    optional,
    actionText: remaining.trim(),
  };
}

function parseTextCosts(text: string): RawCost[] {
  const costs: Array<{ index: number; cost: RawCost }> = [];

  const variableReturnDonMatch =
    /return\s+(\d+)\s+or\s+more\s+DON!!\s+cards?\s+from\s+your\s+field\s+to\s+your\s+DON!!\s+deck/i.exec(
      text,
    );
  if (variableReturnDonMatch) {
    costs.push({
      index: variableReturnDonMatch.index,
      cost: {
        type: "returnDon",
        minimumAmount: parseInt(variableReturnDonMatch[1]!, 10),
      },
    });
  }

  const alternativeTrashCardMatch =
    /trash\s+\d+\s+.+?\s+from\s+your\s+hand\s+or\s+\d+\s+\[[^\]]+\]\s+from\s+your\s+hand\s+or\s+field/i.exec(
      text,
    );
  if (alternativeTrashCardMatch) {
    costs.push({
      index: alternativeTrashCardMatch.index,
      cost: { type: "trashCard", raw: alternativeTrashCardMatch[0] },
    });
  }

  const playCardMatch = /play\s+\d+\s+\[[^\]]+\]\s+from\s+your\s+hand/i.exec(text);
  if (playCardMatch) {
    costs.push({
      index: playCardMatch.index,
      cost: { type: "playCard", raw: playCardMatch[0] },
    });
  }

  const modifyLeaderPowerMatch =
    /give\s+your\s+(?:1\s+)?(active\s+)?Leader\s+([+-]\d+)\s+power\s+during\s+this\s+turn/i.exec(
      text,
    );
  if (modifyLeaderPowerMatch) {
    costs.push({
      index: modifyLeaderPowerMatch.index,
      cost: {
        type: "modifyLeaderPower",
        value: parseInt(modifyLeaderPowerMatch[2]!, 10),
        duration: "thisTurn",
        ...(modifyLeaderPowerMatch[1] && { requiresActive: true }),
      },
    });
  }

  // "You may rest N of your DON!! cards"
  const restDonMatch = /(?:rest|and)\s+(\d+)\s+of\s+your\s+DON!!\s+cards?/i.exec(text);
  if (restDonMatch) {
    costs.push({
      index: restDonMatch.index,
      cost: { type: "restDon", amount: parseInt(restDonMatch[1]!, 10) },
    });
  }
  // "You may trash N card(s) from your hand", optionally filtered by a supported type or Trigger.
  const trashFromHandMatch =
    /trash\s+\d+\s+(?:cards?|(?:Character|Event|Stage)s?|\[[^\]]+\]|Character\s+cards?\s+with\s+a\s+cost\s+of\s+\d+(?:\s+or\s+(?:less|more))?|.+?\s+type\s+(?:Character|Event|Stage)\s+cards?\s+with\s+\d+\s+power(?:\s+or\s+(?:less|more))?|.+?\s+type\s+cards?|cards?\s+with\s+a\s+type\s+including\s+[""\u201c][^""\u201d]+[""\u201d]|cards?\s+with\s+a\s+\[Trigger\])\s+from\s+your\s+hand/i.exec(
      text,
    );
  if (trashFromHandMatch && !alternativeTrashCardMatch) {
    costs.push({
      index: trashFromHandMatch.index,
      cost: { type: "trashFromHand", raw: text },
    });
  }
  const trashFromDeckMatch = /trash\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+deck/i.exec(
    text,
  );
  if (trashFromDeckMatch) {
    costs.push({
      index: trashFromDeckMatch.index,
      cost: {
        type: "trashFromDeck",
        amount: parseInt(trashFromDeckMatch[1]!, 10),
        position: "top",
      },
    });
  }
  // "You may trash N card(s) from the top, bottom, or top or bottom of your Life cards"
  const trashLifeMatch =
    /trash\s+(\d+)\s+cards?\s+from\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+your\s+Life\s+cards?/i.exec(
      text,
    );
  if (trashLifeMatch) {
    const positionText = trashLifeMatch[2]!.toLowerCase().replace(/\s+/g, " ");
    costs.push({
      index: trashLifeMatch.index,
      cost: {
        type: "trashLife",
        amount: parseInt(trashLifeMatch[1]!, 10),
        position: positionText === "top or bottom" ? "choice" : (positionText as "top" | "bottom"),
      },
    });
  }
  // "You may trash N of your <qualified> Characters", including a second
  // Character after "trash this Character and ...".
  const compoundTrashCharacterMatch =
    /trash\s+this\s+(?:Character|Stage|Leader)\s+and\s+\d+\s+of\s+your\s+Characters?\s+with\s+a\s+type\s+including\s+[""\u201c][^""\u201d]+[""\u201d]/i.exec(
      text,
    );
  const trashCharacterMatch =
    /trash\s+\d+\s+of\s+your\s+(?:.+?\s+)?Characters?(?:(?:\s+other\s+than\s+this\s+Character)(?:\s+with\s+\d+\s+power\s+or\s+more)?|(?:\s+with\s+\d+\s+power\s+or\s+more)(?:\s+other\s+than\s+this\s+Character)?|)/i.exec(
      text,
    ) ??
    /\band\s+\d+\s+of\s+your\s+Characters?\s+with\s+a\s+type\s+including\s+["\u201c][^"\u201d]+["\u201d]/i.exec(
      text,
    );
  if (trashCharacterMatch) {
    const raw = trashCharacterMatch[0];
    costs.push({
      index:
        trashCharacterMatch.index +
        (compoundTrashCharacterMatch && raw.toLowerCase().startsWith("and")
          ? raw.toLowerCase().indexOf("and")
          : 0),
      cost: { type: "trashCharacter", raw },
    });
  }
  // "You may K.O. N of your Characters other than this Character"
  const koCharacterMatch =
    /K\.O\.\s+\d+\s+of\s+your\s+(?:\[[^\]]+\]\s+type\s+)?Characters?(?:\s+other\s+than\s+this\s+Character)?/i.exec(
      text,
    );
  if (koCharacterMatch) {
    costs.push({
      index: koCharacterMatch.index,
      cost: { type: "koCharacter", raw: koCharacterMatch[0] },
    });
  }
  // "You may rest this Character/Stage/Leader/card"
  const restThisMatch =
    /rest\s+this\s+(character|stage|leader|card)/i.exec(text) ??
    (restDonMatch ? /\band\s+this\s+(character|stage|leader)/i.exec(text) : null);
  if (restThisMatch) {
    costs.push({ index: restThisMatch.index, cost: { type: "restThisCard" } });
  }
  // "You may trash this Character/Stage/Leader"
  const trashThisMatch = /trash\s+this\s+(character|stage|leader)/i.exec(text);
  if (trashThisMatch) {
    costs.push({ index: trashThisMatch.index, cost: { type: "trashThisCard" } });
  }
  // "You may return this Character to the owner's hand"
  const returnThisToHandMatch =
    /return\s+this\s+character\s+to\s+(?:the\s+owner[''\u2019]s|your)\s+hand/i.exec(text);
  if (returnThisToHandMatch) {
    costs.push({ index: returnThisToHandMatch.index, cost: { type: "returnThisToHand" } });
  }
  // "You may place this Character/Stage/card at the top/bottom of the owner's deck"
  const returnThisToDeckMatch =
    /place\s+this\s+(?:character|stage|card)\s+at\s+the\s+(top|bottom)\s+of\s+(?:the\s+owner[''\u2019]s|your)\s+deck/i.exec(
      text,
    );
  if (returnThisToDeckMatch) {
    costs.push({
      index: returnThisToDeckMatch.index,
      cost: {
        type: "returnThisToDeck",
        position: returnThisToDeckMatch[1]!.toLowerCase() as "top" | "bottom",
      },
    });
  }
  const returnThisAndHandToDeckMatch =
    /place\s+this\s+(?:card|Character|Stage)\s+and\s+(\d+)\s+cards?\s+from\s+your\s+hand\s+at\s+the\s+(top|bottom)\s+of\s+your\s+deck(?:\s+in\s+any\s+order)?/i.exec(
      text,
    );
  if (returnThisAndHandToDeckMatch) {
    costs.push({
      index: returnThisAndHandToDeckMatch.index,
      cost: {
        type: "returnThisAndHandToDeck",
        handAmount: parseInt(returnThisAndHandToDeckMatch[1]!, 10),
        position: returnThisAndHandToDeckMatch[2]!.toLowerCase() as "top" | "bottom",
      },
    });
  }
  const returnThisAndTrashToDeckMatch =
    /place\s+this\s+(?:card|Character|Stage)\s+and\s+(\d+)\s+(.+?)\s+from\s+your\s+trash\s+at\s+the\s+(top|bottom)\s+of\s+your\s+deck(?:\s+in\s+any\s+order)?/i.exec(
      text,
    );
  if (returnThisAndTrashToDeckMatch) {
    const position = returnThisAndTrashToDeckMatch[3]!.toLowerCase() as "top" | "bottom";
    costs.push({
      index: returnThisAndTrashToDeckMatch.index,
      cost: { type: "returnThisToDeck", position },
    });
    costs.push({
      index: returnThisAndTrashToDeckMatch.index,
      cost: {
        type: "returnFromTrashToDeck",
        raw: `place ${returnThisAndTrashToDeckMatch[1]} ${returnThisAndTrashToDeckMatch[2]} from your trash at the ${position} of your deck`,
      },
    });
  }
  // "You may turn N card(s) from the top of your Life cards face-up/face-down"
  const faceUpMatch =
    /turn\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+Life\s+cards?\s+face-(up|down)/i.exec(
      text,
    );
  if (faceUpMatch) {
    costs.push({
      index: faceUpMatch.index,
      cost: {
        type: "turnLifeFaceUp",
        count: parseInt(faceUpMatch[1]!, 10),
        faceUp: faceUpMatch[2]!.toLowerCase() === "up",
      },
    });
  }
  // "You may return N of your Characters to the owner's hand"
  // "You may return N Character to your hand"
  const returnCharacterMatch =
    /return\s+\d+\s+(?:(?:of\s+your\s+(?:.+?\s+)?)?Characters?)(?:\s+with\s+a\s+cost\s+of\s+\d+(?:\s+or\s+(?:less|more))?)?\s+to\s+(?:the\s+owner[''\u2019]s|your)\s+hand/i.exec(
      text,
    );
  if (returnCharacterMatch) {
    costs.push({
      index: returnCharacterMatch.index,
      cost: { type: "returnCharacter", raw: returnCharacterMatch[0] },
    });
  }
  // "You may place N [qualified] Character(s)/Stage(s) at the top/bottom of the owner's deck"
  const returnCharacterToDeckMatch =
    /place\s+\d+\s+(?:(?:of\s+your|of\s+your\s+opponent['\u2019]s)\s+)?(?:Characters?|Stages?)(?:\s+other\s+than\s+this\s+Character)?(?:\s+with\s+(?:a\s+cost\s+of\s+\d+(?:\s+or\s+(?:less|more))?|\d+\s+base\s+power))?\s+at\s+the\s+(?:top|bottom)\s+of\s+(?:the\s+owner['\u2019]s|your)\s+deck/i.exec(
      text,
    );
  if (returnCharacterToDeckMatch) {
    costs.push({
      index: returnCharacterToDeckMatch.index,
      cost: { type: "returnCharacterToDeck", raw: returnCharacterToDeckMatch[0] },
    });
  }
  // "You may place/return N cards from your trash at/to the bottom of your deck"
  const returnFromTrashMatch =
    /(?:place|return)\s+\d+\s+.+?\s+from\s+your\s+trash\s+(?:(?:at|to)\s+the\s+bottom\s+of\s+your\s+deck|to\s+your\s+deck\s+and\s+shuffle\s+it)/i.exec(
      text,
    );
  if (returnFromTrashMatch) {
    costs.push({
      index: returnFromTrashMatch.index,
      cost: { type: "returnFromTrashToDeck", raw: returnFromTrashMatch[0] },
    });
  }
  // "You may place N cards from your hand at the top/bottom of your deck"
  const returnHandToDeckMatch =
    /place\s+(\d+)\s+cards?\s+from\s+your\s+hand\s+at\s+the\s+(top|bottom)\s+of\s+your\s+deck/i.exec(
      text,
    );
  if (returnHandToDeckMatch) {
    costs.push({
      index: returnHandToDeckMatch.index,
      cost: {
        type: "returnHandToDeck",
        amount: parseInt(returnHandToDeckMatch[1]!, 10),
        position: returnHandToDeckMatch[2]!.toLowerCase() as "top" | "bottom",
      },
    });
  }
  // "You may add N cards from the top, bottom, or top or bottom of your Life cards to your hand"
  const addLifeToHandMatch =
    /add\s+(\d+)\s+cards?\s+from\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+your\s+Life\s+cards?\s+to\s+your\s+hand/i.exec(
      text,
    );
  if (addLifeToHandMatch) {
    const positionText = addLifeToHandMatch[2]!.toLowerCase().replace(/\s+/g, " ");
    costs.push({
      index: addLifeToHandMatch.index,
      cost: {
        type: "addLifeToHand",
        amount: parseInt(addLifeToHandMatch[1]!, 10),
        position: positionText === "top or bottom" ? "choice" : (positionText as "top" | "bottom"),
      },
    });
  }
  const revealFromHandMatch = /reveal\s+\d+\s+.+?\s+from\s+your\s+hand/i.exec(text);
  if (revealFromHandMatch) {
    costs.push({
      index: revealFromHandMatch.index,
      cost: { type: "revealFromHand", raw: text },
    });
  }
  // "You may rest N of your cards/Characters/...", "rest your N Leader", or "rest your Leader"
  // (but NOT "DON!! cards" — that's restDon).
  const restLeaderOrStageMatch =
    /rest\s+your\s+Leader\s+or\s+\d+\s+of\s+your\s+Stage\s+cards?/i.exec(text);
  const boundedRestCardsMatch =
    /rest\s+\d+\s+of\s+your\s+(?!DON!!).+?(?:cards?|Characters?|Leaders?|Stages?)(?=\s*(?:,\s+and\s+return|:))/i.exec(
      text,
    );
  const restCardsMatch =
    restLeaderOrStageMatch ??
    boundedRestCardsMatch ??
    /rest\s+\d+\s+of\s+your\s+(?!DON!!)/i.exec(text) ??
    /rest\s+this\s+(?:Character|Leader|Stage|card)\s+and\s+\d+\s+of\s+your\s+(?!DON!!).+/i.exec(
      text,
    ) ??
    /rest\s+your\s+\d+\s+(?:Leader|Character|Stage)/i.exec(text) ??
    /rest\s+your\s+(?:Leader|Character|Stage)/i.exec(text);
  if (restCardsMatch) {
    costs.push({
      index: restCardsMatch.index,
      cost: {
        type: "restCards",
        raw:
          restCardsMatch === restLeaderOrStageMatch || restCardsMatch === boundedRestCardsMatch
            ? restCardsMatch[0]
            : text,
      },
    });
  }
  return costs.length > 0
    ? costs.sort((left, right) => left.index - right.index).map(({ cost }) => cost)
    : [{ type: "unknown", raw: text }];
}

// ── Choose one parsing ──

function parseChoicePattern(actionText: string): {
  prefix: string;
  choiceItems?: string[];
  postChoiceActionText?: string;
} {
  const chooseIdx = actionText.toLowerCase().indexOf("choose one:");
  if (chooseIdx === -1) return { prefix: actionText };

  const prefix = actionText.slice(0, chooseIdx).trim();
  const afterChoose = actionText.slice(chooseIdx + "Choose one:".length);

  // Split on bullet character (•) — handles both \n• and space-separated •
  const items = afterChoose
    .split("•")
    .map((s) => s.trim())
    .filter(Boolean);

  let postChoiceActionText: string | undefined;
  const lastItem = items.at(-1);
  if (lastItem) {
    const trailingThen = /^(.*?)\.\s*Then,\s*(.+)$/is.exec(lastItem);
    if (trailingThen) {
      items[items.length - 1] = `${trailingThen[1]!.trim()}.`;
      postChoiceActionText = trailingThen[2]!.trim();
    }
  }

  return {
    prefix: prefix || "Choose one:",
    choiceItems: items.length > 0 ? items : undefined,
    ...(postChoiceActionText && { postChoiceActionText }),
  };
}

// ── Main public function ──

export function parseEffectText(text: string): ParsedEffectText {
  if (!text || !text.trim()) {
    return { plainStatements: [], segments: [] };
  }

  // Step 1: Strip errata
  const { cleaned, errata } = stripErrata(text);

  // Step 2: Strip flavor parentheticals
  const stripped = stripFlavorParentheticals(cleaned);

  // Step 2b-pre: Fix missing comma after "K.O.'d" before action text
  let fixed = stripped.replace(
    /\bK\.O\.\u2019?'?d\s+(?=add\s|draw\s|play\s|rest\s|return\s|give\s|place\s|trash\s|K\.O\.\s)/gi,
    (m) => m.trimEnd() + ", ",
  );

  // Step 2b: Fix malformed trigger brackets: "[When Attacking (1) :" → "[When Attacking] (1) :"
  fixed = fixed.replace(
    /\[(When Attacking|On Play|Main|Counter|On Block|On K\.O\.|Activate:? Main)\s*\((\d+)\)\s*:/gi,
    "[$1] ($2) :",
  );

  // Step 3: Keep [Trigger] as a first-class effect segment. Normalized card
  // data may store its printed Trigger separately, but generation combines it
  // with the main effect text before parsing.
  if (!fixed.trim()) {
    return { plainStatements: [], segments: [], ...(errata && { errata }) };
  }

  // Step 4: Split into lines
  const lines = splitIntoLines(fixed);

  // Step 5: Process each line
  const plainStatements: string[] = [];
  const segments: RawEffectSegment[] = [];

  for (const line of lines) {
    const previousSegment = segments.at(-1);
    if (
      /^Then,\s*/i.test(line) &&
      previousSegment?.choiceItems?.length &&
      !previousSegment.postChoiceActionText
    ) {
      previousSegment.postChoiceActionText = line.replace(/^Then,\s*/i, "").trim();
      continue;
    }

    if (/^This\s+effect\s+can\s+be\s+activated\s+when\b/i.test(line)) {
      processSegment(line, segments);
      continue;
    }

    // Check if line starts with a known bracket
    if (!startsWithKnownBracket(line)) {
      // Try to split plain text prefix from bracket suffix
      const { plain, rest } = splitPlainPrefix(line);
      if (plain) {
        plainStatements.push(plain);
      }
      if (rest && startsWithKnownBracket(rest)) {
        processSegment(rest, segments);
      } else if (!plain) {
        // Entire line is plain text
        plainStatements.push(line);
      }
      continue;
    }

    processSegment(line, segments);
  }

  return {
    plainStatements,
    segments,
    ...(errata && { errata }),
  };
}

function processSegment(line: string, segments: RawEffectSegment[]): void {
  const prefix = parsePrefixChain(line);

  // Skip segments that are purely keyword declarations with no action text
  if (
    prefix.triggers.length === 0 &&
    prefix.conditions.length === 0 &&
    !prefix.oncePerTurn &&
    prefix.costs.length === 0 &&
    !prefix.actionText
  ) {
    return;
  }

  // Parse "Choose one:" in action text
  const {
    prefix: actionPrefix,
    choiceItems,
    postChoiceActionText,
  } = parseChoicePattern(prefix.actionText);

  segments.push({
    triggers: prefix.triggers,
    conditions: prefix.conditions,
    oncePerTurn: prefix.oncePerTurn,
    costs: prefix.costs,
    optional: prefix.optional,
    rawActionText: actionPrefix,
    ...(choiceItems && { choiceItems }),
    ...(postChoiceActionText && { postChoiceActionText }),
  });
}
