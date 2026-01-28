import type { Action, EffectCondition, TargetQuery } from "@tcg/gundam-types";
import { parseTarget } from "./target-parser";

export function parseAction(
  text: string,
  contextTarget?: TargetQuery | TargetQuery[],
): Action {
  // 0. Sequence Logic (Sentence splitting)
  // Split by ". " or just "." if followed by space/end, but avoid "Lv.X" etc.
  // We use a safe split approach.
  const potentialSentences = text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);

  if (potentialSentences && potentialSentences.length > 1) {
    const actions: Action[] = [];
    const allValid = true;

    for (const sentence of potentialSentences) {
      const cleanSentence = sentence.trim().replace(/[.!?]$/, "");
      if (!cleanSentence) continue;

      // Avoid infinite recursion if sentence is same as text (shouldn't happen with split)
      if (cleanSentence === text) continue;

      const action = parseAction(cleanSentence, contextTarget);
      actions.push(action);
    }

    if (actions.length > 1) {
      return {
        type: "SEQUENCE",
        actions,
      };
    }
  }

  const lower = text.toLowerCase();

  // 0. Conditional Logic
  // "If X, do Y"
  if (lower.startsWith("if ")) {
    // Try to split condition and action
    // "If you have 2 or more cards in hand, draw 1 card."
    const splitMatch = text.match(/^If (.*?),\s*(.*)$/i);
    if (splitMatch) {
      const conditionText = splitMatch[1];
      const actionText = splitMatch[2];

      const conditions: EffectCondition[] = [];

      // Parse condition
      if (
        conditionText.toLowerCase().includes("have") ||
        conditionText.toLowerCase().includes("are")
      ) {
        // "you have 2 or more cards" -> HAS_CARD
        // "there are 2 or more enemy units" -> HAS_UNIT
        conditions.push({
          type: "STATE_CHECK",
          text: conditionText,
        });
      }

      const trueAction = parseAction(actionText, contextTarget);

      return {
        type: "CONDITIONAL",
        conditions,
        trueAction,
      };
    }
  }

  // 1. Draw
  if (lower.startsWith("draw")) {
    const match = text.match(/draw (\d+)/i);
    const value = match ? Number.parseInt(match[1], 10) : 1;
    return { type: "DRAW", value };
  }

  // 2. Heal / Recover
  if (
    lower.includes("recover") ||
    (lower.includes("gain") && lower.includes("hp"))
  ) {
    const match = text.match(/(?:recover|gain)s? (\d+) HP/i);
    const amount = match ? Number.parseInt(match[1], 10) : 1;
    return { type: "HEAL", amount, target: contextTarget };
  }

  // 3. Damage
  if (lower.includes("deal") && lower.includes("damage")) {
    const match = text.match(/deal (\d+) damage/i);
    const value = match ? Number.parseInt(match[1], 10) : 0;

    let target: TargetQuery | TargetQuery[] | undefined = contextTarget;

    const toMatch = text.match(/to (.*?)(?:\.|$)/i);
    if (toMatch) {
      const res = parseTarget(toMatch[1]);
      if (res) target = res.query;
    }

    return { type: "DAMAGE", value, target };
  }

  // 4. Search
  if (lower.includes("search")) {
    return {
      type: "SEARCH",
      destination: "hand",
      count: 1,
    };
  }

  // 5. Rest / Stand
  if (lower.startsWith("rest ") || lower.includes("set it as rest")) {
    let target: TargetQuery | TargetQuery[] | undefined = contextTarget;
    const targetText = text.substring(5);
    const res = parseTarget(targetText);
    if (res) target = res.query;

    return { type: "REST", target } as any;
  }

  if (lower.startsWith("stand ") || lower.includes("set it as active")) {
    return { type: "STAND", target: contextTarget } as any;
  }

  // 6. Deploy
  if (lower.startsWith("deploy")) {
    return { type: "DEPLOY", target: contextTarget } as any;
  }

  // 7. Add to hand / Return to hand
  if (
    (lower.includes("add") || lower.includes("return")) &&
    lower.includes("hand")
  ) {
    // Check for "Return X to hand" or "Return it to hand"
    if (lower.includes("return")) {
      // "Return it to hand" -> target is contextTarget
      // "Return 1 enemy unit to hand" -> parse target
      if (!lower.includes("it")) {
        // Try to parse target from text
        // "Return target enemy unit to its owner's hand"
        // Remove "return" and "to ... hand" to isolate target text?
        // Or just try parseTarget on the whole string? parseTarget is strict about "Choose" or "All" or "This".
        // Maybe we need to look for "Choose" inside?
        // Or if parseTarget supports implicit text?
        // Let's assume for now if it's not "it", we might miss it unless we improve target parser.
        // But if we have "Choose 1 enemy unit. Return it...", then contextTarget is set.
      }
    }
    return { type: "ADD_TO_HAND", target: contextTarget } as any;
  }

  // 8. Modify Stats
  // "gets AP-2", "gains AP+1"
  const statMatch = text.match(/(AP|HP)\s*([+-]?\d+)/i);
  if (statMatch) {
    return {
      type: "MODIFY_STATS",
      attribute: statMatch[1].toUpperCase(),
      value: Number.parseInt(statMatch[2], 10),
      duration: "TURN",
      target: contextTarget,
    } as any;
  }

  // 9. Gain Keywords
  if (
    lower.includes("gain") ||
    lower.includes("get") ||
    lower.includes("have")
  ) {
    const keywordMatches = [...text.matchAll(/<([^>]+)>/g)];
    if (keywordMatches.length > 0) {
      return {
        type: "GAIN_KEYWORDS",
        keywords: keywordMatches.map((m) => m[1]),
        duration: lower.includes("turn") ? "TURN" : "PERMANENT",
        target: contextTarget,
      } as any;
    }
  }

  // 10. Discard
  if (lower.startsWith("discard")) {
    const match = text.match(/discard (\d+)/i);
    const value = match ? Number.parseInt(match[1], 10) : 1;
    return { type: "DISCARD", value } as any;
  }

  return { type: "CUSTOM", text };
}
