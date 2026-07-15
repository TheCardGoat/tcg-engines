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
    const donReturnMatch = /^DON!!\s*-?\s*(\d+)\s*/.exec(remaining);
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

  // Now handle cost text before the colon separator
  // Look for "You may <cost>:" pattern
  const costColonMatch = /^(You may .+?):\s*/i.exec(remaining);
  if (costColonMatch) {
    const costText = costColonMatch[1]!;
    optional = true;
    const cost = parseTextCost(costText);
    costs.push(cost);
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

  return {
    triggers,
    conditions,
    oncePerTurn,
    costs,
    optional,
    actionText: remaining.trim(),
  };
}

function parseTextCost(text: string): RawCost {
  // "You may trash N card(s) from your hand"
  if (/trash\s+\d+\s+cards?\s+from\s+your\s+hand/i.test(text)) {
    return { type: "trashFromHand", raw: text };
  }
  // "You may rest this Character/Stage/Leader"
  if (/rest\s+this\s+(character|stage|leader)/i.test(text)) {
    return { type: "restThisCard" };
  }
  // "You may trash this Character/Stage/Leader"
  if (/trash\s+this\s+(character|stage|leader)/i.test(text)) {
    return { type: "trashThisCard" };
  }
  // "You may turn N card(s) from the top of your Life cards face-up/face-down"
  const faceUpMatch =
    /turn\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+Life\s+cards?\s+face-(up|down)/i.exec(
      text,
    );
  if (faceUpMatch) {
    return { type: "turnLifeFaceUp", count: parseInt(faceUpMatch[1]!, 10) };
  }
  // "You may rest N of your cards/Characters/..." (but NOT "DON!! cards" — that's restDon)
  if (/rest\s+\d+\s+of\s+your\s+(?!DON!!)/i.test(text)) {
    return { type: "restCards", raw: text };
  }
  return { type: "unknown", raw: text };
}

// ── Choose one parsing ──

function parseChoicePattern(actionText: string): {
  prefix: string;
  choiceItems?: string[];
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

  return {
    prefix: prefix || "Choose one:",
    choiceItems: items.length > 0 ? items : undefined,
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

  // Step 3: Strip [Trigger] section (if it somehow leaks through)
  const triggerSplit = /(?:^|\n)\[Trigger\]\s*[\s\S]*$/i;
  const withoutTrigger = fixed.replace(triggerSplit, "").trim();

  if (!withoutTrigger) {
    return { plainStatements: [], segments: [], ...(errata && { errata }) };
  }

  // Step 4: Split into lines
  const lines = splitIntoLines(withoutTrigger);

  // Step 5: Process each line
  const plainStatements: string[] = [];
  const segments: RawEffectSegment[] = [];

  for (const line of lines) {
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
  const { prefix: actionPrefix, choiceItems } = parseChoicePattern(prefix.actionText);

  segments.push({
    triggers: prefix.triggers,
    conditions: prefix.conditions,
    oncePerTurn: prefix.oncePerTurn,
    costs: prefix.costs,
    optional: prefix.optional,
    rawActionText: actionPrefix,
    ...(choiceItems && { choiceItems }),
  });
}
