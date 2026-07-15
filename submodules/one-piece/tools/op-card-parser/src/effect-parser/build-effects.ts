import type {
  Action,
  CardEffects,
  Condition,
  Cost,
  EffectBlock,
  PermanentEffect,
  ReplacementEffect,
  TargetFilter,
} from "@tcg/op-types";
import type { RawCost } from "./types.ts";
import { parseKeywords } from "./keywords.ts";
import { parseEffectText } from "./text-parser.ts";
import { parseActions } from "./action-parsers/index.ts";
import { parseInlineCondition } from "./condition-parser/index.ts";

// ── RawCost → Cost mapping ──

function mapRawCost(raw: RawCost): Cost | null {
  switch (raw.type) {
    case "restDon":
      return { cost: "restDon", amount: raw.amount };
    case "returnDon":
      return { cost: "returnDon", amount: raw.amount };
    case "restThisCard":
      return { cost: "restThisCard" };
    case "trashThisCard":
      return { cost: "trashThisCard" };
    case "turnLifeFaceUp":
      return { cost: "turnLifeFaceUp", count: raw.count };
    case "trashFromHand": {
      const match = /(\d+)/.exec(raw.raw);
      return match ? { cost: "trashFromHand", amount: parseInt(match[1]!, 10) } : null;
    }
    case "restCards": {
      const match = /rest\s+(\d+)\s+of\s+your\s+(.+)/i.exec(raw.raw);
      if (!match) return null;
      const amount = parseInt(match[1]!, 10);
      const desc = match[2]!.trim().replace(/\s+cards?$/i, "");
      const filters: TargetFilter[] = [];

      // Extract trait: "Dressrosa" or {Trait} or [Trait]
      const traitMatch = /[""[{]([^""\]}]+)[""\]}]\s+type/i.exec(desc);
      if (traitMatch) {
        filters.push({ filter: "trait", value: traitMatch[1]! });
      }

      // Extract card categories: "Leader or Stage", "Characters", etc.
      const catMap: Record<string, string> = {
        leader: "leader",
        leaders: "leader",
        character: "character",
        characters: "character",
        stage: "stage",
        stages: "stage",
        event: "event",
        events: "event",
      };
      const afterType = traitMatch
        ? desc.slice(traitMatch.index! + traitMatch[0].length).trim()
        : desc;
      const catWords = afterType.split(/\s+or\s+/i);
      for (const word of catWords) {
        const key = word.trim().toLowerCase();
        if (catMap[key]) {
          filters.push({
            filter: "cardCategory",
            value: catMap[key]! as "leader" | "character" | "event" | "stage" | "don",
          });
        }
      }

      return { cost: "restCards", amount, ...(filters.length > 0 && { filters }) };
    }
    case "unknown":
      return null;
  }
}

// ── Card effects builder ──

/**
 * Build a complete `CardEffects` object from card effect text.
 *
 * Combines keyword parsing, effect text decomposition, and action parsing
 * into a single pipeline. Only includes `EffectBlock`s where at least one
 * action was successfully parsed.
 */
export function buildCardEffects(effectText: string): CardEffects | undefined {
  if (!effectText) return undefined;

  const keywords = parseKeywords(effectText);
  const parsed = parseEffectText(effectText);

  const effectBlocks: EffectBlock[] = [];
  const permanentEffects: PermanentEffect[] = [];
  const replacementEffects: ReplacementEffect[] = [];

  for (const seg of parsed.segments) {
    // Extract inline "If <condition>, ..." from the start of action text
    let actionText = seg.rawActionText;
    const inlineConditions: Condition[] = [];

    const inlineCond = parseInlineCondition(actionText);
    if (inlineCond) {
      inlineConditions.push(inlineCond.condition);
      actionText = inlineCond.remainingText;
    }

    const actionsResult = parseActions(actionText);

    // Handle "Choose one:" segments — parse each choice item independently
    if (seg.choiceItems && seg.choiceItems.length > 0) {
      const options: Action[][] = [];
      for (const item of seg.choiceItems) {
        // Try inline condition on each choice item
        let itemText = item;
        const itemCond = parseInlineCondition(itemText);
        if (itemCond) itemText = itemCond.remainingText;

        const itemResult = parseActions(itemText);
        if (itemResult.parsed.length > 0) {
          options.push(itemResult.parsed);
        }
      }
      if (options.length > 0) {
        actionsResult.parsed.push({
          action: "choice",
          options,
        });
      }
    }

    if (actionsResult.parsed.length === 0) continue;

    const allConditions: Condition[] = [...seg.conditions, ...inlineConditions];

    const costs: Cost[] = [];
    for (const raw of seg.costs) {
      const mapped = mapRawCost(raw);
      if (mapped) costs.push(mapped);
    }

    // Check for replacement conditions — build ReplacementEffect
    const replacementConds = findReplacementConditions(allConditions);
    if (replacementConds.length > 0 && actionsResult.parsed.length > 0) {
      const nonReplacementConds = allConditions.filter(
        (c) => !replacementConds.includes(c) && c.condition !== "compound",
      );
      // For compound replacement conditions, create one ReplacementEffect per replaced event
      const compoundConds = allConditions.filter(
        (c): c is Extract<Condition, { condition: "compound" }> =>
          c.condition === "compound" && c.conditions.some((sub) => sub.condition === "replacement"),
      );
      const simpleRepConds = replacementConds.filter((c) => c.condition === "replacement") as Array<
        Extract<Condition, { condition: "replacement" }>
      >;

      for (const rc of simpleRepConds) {
        replacementEffects.push({
          replacedEvent: mapReplacementEvent(rc.event),
          replacementAction: actionsResult.parsed[0]!,
          ...(nonReplacementConds.length > 0 && { conditions: nonReplacementConds }),
          ...(seg.oncePerTurn && { oncePerTurn: true }),
        });
      }
      for (const cc of compoundConds) {
        const repSubs = cc.conditions.filter(
          (c): c is Extract<Condition, { condition: "replacement" }> =>
            c.condition === "replacement",
        );
        const otherConds = [
          ...nonReplacementConds,
          ...cc.conditions.filter((c) => c.condition !== "replacement"),
        ];
        for (const rc of repSubs) {
          replacementEffects.push({
            replacedEvent: mapReplacementEvent(rc.event),
            replacementAction: actionsResult.parsed[0]!,
            ...(otherConds.length > 0 && { conditions: otherConds }),
            ...(seg.oncePerTurn && { oncePerTurn: true }),
          });
        }
      }
      continue;
    }

    // Check if an inline condition is a TriggerEventCondition — convert to EffectBlock trigger
    const triggerEventCond = allConditions.find(
      (c): c is Extract<Condition, { condition: "triggerEvent" }> => c.condition === "triggerEvent",
    );
    const remainingConditions = triggerEventCond
      ? allConditions.filter((c) => c !== triggerEventCond)
      : allConditions;

    if (seg.triggers.length === 0 && triggerEventCond) {
      // "When X, Y" pattern → EffectBlock with X as trigger
      effectBlocks.push({
        trigger: triggerEventCond.event,
        ...(remainingConditions.length > 0 && { conditions: remainingConditions }),
        ...(costs.length > 0 && { costs }),
        actions: actionsResult.parsed,
        ...(seg.optional && { optional: true }),
        ...(seg.oncePerTurn && { oncePerTurn: true }),
      });
    } else if (seg.triggers.length === 0) {
      permanentEffects.push({
        ...(remainingConditions.length > 0 && { conditions: remainingConditions }),
        actions: actionsResult.parsed,
      });
    } else {
      for (const trigger of seg.triggers) {
        effectBlocks.push({
          trigger,
          ...(remainingConditions.length > 0 && { conditions: remainingConditions }),
          ...(costs.length > 0 && { costs }),
          actions: actionsResult.parsed,
          ...(seg.optional && { optional: true }),
          ...(seg.oncePerTurn && { oncePerTurn: true }),
        });
      }
    }
  }

  if (
    keywords.length === 0 &&
    effectBlocks.length === 0 &&
    permanentEffects.length === 0 &&
    replacementEffects.length === 0
  ) {
    return undefined;
  }

  const result: CardEffects = {};
  if (keywords.length > 0) result.keywords = keywords;
  if (effectBlocks.length > 0) result.effects = effectBlocks;
  if (permanentEffects.length > 0) result.permanentEffects = permanentEffects;
  if (replacementEffects.length > 0) result.replacementEffects = replacementEffects;
  return result;
}

// ── Replacement effect helpers ──

function findReplacementConditions(conditions: Condition[]): Condition[] {
  const result: Condition[] = [];
  for (const c of conditions) {
    if (c.condition === "replacement") {
      result.push(c);
    } else if (
      c.condition === "compound" &&
      c.conditions.some((sub) => sub.condition === "replacement")
    ) {
      result.push(c);
    }
  }
  return result;
}

function mapReplacementEvent(
  event: "ko" | "removed" | "rested" | "leave",
): "ko" | "removeFromField" | "leaveField" | "rested" {
  switch (event) {
    case "ko":
      return "ko";
    case "removed":
      return "removeFromField";
    case "leave":
      return "leaveField";
    case "rested":
      return "rested";
  }
}
