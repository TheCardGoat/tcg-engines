import type { AbilityDefinition } from "@tcg/lorcana-types";
import type { AbilitySignals, AbilitySummary, RecursiveObject, RecursiveValue } from "./types";
import { NON_EFFECT_FAMILY_TYPES } from "./types";
import { isRecursiveObject, visitRecursive } from "./utils";

export function hasInChallengeRestriction(value: RecursiveValue): boolean {
  let found = false;

  visitRecursive(value, (node) => {
    if (node.type === "in-challenge") {
      found = true;
    }
  });

  return found;
}

export function collectRecursiveKeywords(node: RecursiveObject, output: Set<string>): void {
  if (node.grantsRush === true) {
    output.add("Rush");
  }

  if (typeof node.keyword === "string" && node.keyword.trim()) {
    output.add(node.keyword.trim());
  }

  const { keywords } = node;
  if (!keywords) return;

  if (typeof keywords === "string" && keywords.trim()) {
    output.add(keywords.trim());
    return;
  }

  if (!Array.isArray(keywords)) return;

  for (const entry of keywords) {
    if (typeof entry === "string" && entry.trim()) {
      output.add(entry.trim());
      continue;
    }

    if (!isRecursiveObject(entry)) continue;
    if (typeof entry.keyword === "string" && entry.keyword.trim()) {
      output.add(entry.keyword.trim());
    }
  }
}

export function collectGrantedKeywords(node: RecursiveObject, output: Set<string>): void {
  if (node.grantsRush === true) {
    output.add("Rush");
  }

  if (
    node.type === "gain-keyword" ||
    node.type === "gain-keywords" ||
    node.type === "grant-ability" ||
    node.type === "grant-abilities-while-here"
  ) {
    collectRecursiveKeywords(node, output);
  }
}

export function collectAbilitySignals(abilities: AbilityDefinition[] | undefined): AbilitySignals {
  const topLevelTypes = new Set<string>();
  const nestedTypes = new Set<string>();
  const topLevelTriggerEvents = new Set<string>();
  const nestedTriggerEvents = new Set<string>();
  const topLevelTriggerSubjects = new Set<string>();
  const effectFamilies = new Set<string>();
  const keywords = new Set<string>();
  const grantedKeywords = new Set<string>();

  for (const ability of abilities ?? []) {
    topLevelTypes.add(ability.type);

    if (ability.type === "keyword" && typeof ability.keyword === "string") {
      keywords.add(ability.keyword);
    }

    if (ability.type === "triggered" && typeof ability.trigger.event === "string") {
      topLevelTriggerEvents.add(ability.trigger.event);
      if (typeof ability.trigger.on === "string") {
        topLevelTriggerSubjects.add(ability.trigger.on);
      }

      if (ability.trigger.event === "banish" && hasInChallengeRestriction(ability.trigger)) {
        topLevelTriggerEvents.add("banish-in-challenge");
      }
    }

    if (ability.type === "triggered" && Array.isArray(ability.trigger.events)) {
      for (const event of ability.trigger.events) {
        if (typeof event === "string") {
          topLevelTriggerEvents.add(event);
        }
      }
      if (typeof ability.trigger.on === "string") {
        topLevelTriggerSubjects.add(ability.trigger.on);
      }
    }

    if (ability.type === "replacement" && typeof ability.replaces === "string") {
      effectFamilies.add(`replacement:${ability.replaces}`);
    }

    visitRecursive(ability as RecursiveObject, (node) => {
      if (typeof node.type === "string") {
        nestedTypes.add(node.type);
        if (!NON_EFFECT_FAMILY_TYPES.has(node.type)) {
          effectFamilies.add(node.type);
        }
      }

      if (
        node.trigger &&
        isRecursiveObject(node.trigger) &&
        typeof node.trigger.event === "string"
      ) {
        nestedTriggerEvents.add(node.trigger.event);

        if (node.trigger.event === "banish" && hasInChallengeRestriction(node.trigger)) {
          nestedTriggerEvents.add("banish-in-challenge");
        }
      }

      if (node.trigger && isRecursiveObject(node.trigger) && Array.isArray(node.trigger.events)) {
        for (const event of node.trigger.events) {
          if (typeof event === "string") {
            nestedTriggerEvents.add(event);
          }
        }
      }

      collectRecursiveKeywords(node, keywords);
      collectGrantedKeywords(node, grantedKeywords);
    });
  }

  const hasTopLevelTriggered = topLevelTypes.has("triggered");
  const hasTopLevelReplacement = topLevelTypes.has("replacement");
  const hasActivatedSupport =
    topLevelTypes.has("activated") ||
    nestedTypes.has("activated") ||
    nestedTypes.has("grant-ability") ||
    nestedTypes.has("grant-abilities-while-here");
  const hasFloatingTriggeredAction =
    topLevelTypes.has("action") && nestedTypes.has("create-triggered-ability");
  const hasCostReductionSupport =
    nestedTypes.has("cost-reduction") || nestedTypes.has("move-cost-reduction");
  const hasKeywordGrantSupport =
    nestedTypes.has("gain-keyword") ||
    nestedTypes.has("gain-keywords") ||
    nestedTypes.has("grant-ability") ||
    nestedTypes.has("grant-abilities-while-here") ||
    grantedKeywords.size > 0;

  return {
    abilityCount: abilities?.length ?? 0,
    topLevelTypes: [...topLevelTypes].sort(),
    nestedTypes: [...nestedTypes].sort(),
    topLevelTriggerEvents: [...topLevelTriggerEvents].sort(),
    nestedTriggerEvents: [...nestedTriggerEvents].sort(),
    effectFamilies: [...effectFamilies].sort(),
    keywords: [...keywords].sort(),
    grantedKeywords: [...grantedKeywords].sort(),
    hasTopLevelTriggered,
    hasTopLevelReplacement,
    hasActivatedSupport,
    hasFloatingTriggeredAction,
    hasCostReductionSupport,
    hasKeywordGrantSupport,
    topLevelTriggerSubjects: [...topLevelTriggerSubjects].sort(),
  };
}

export function summarizeSignals(signals: AbilitySignals): string {
  const topLevel = signals.topLevelTypes.join(", ") || "none";
  const triggers =
    [...new Set([...signals.topLevelTriggerEvents, ...signals.nestedTriggerEvents])].join(", ") ||
    "none";
  const effects = signals.effectFamilies.join(", ") || "none";
  const keywords = signals.keywords.join(", ") || "none";

  return `count=${signals.abilityCount}; top=${topLevel}; triggers=${triggers}; effects=${effects}; keywords=${keywords}`;
}

export function summarizeAbilityForParity(card: {
  abilities?: AbilityDefinition[];
}): AbilitySummary {
  const signals = collectAbilitySignals(card.abilities);
  const triggerEvents = [
    ...new Set([...signals.topLevelTriggerEvents, ...signals.nestedTriggerEvents]),
  ];

  return {
    abilityCount: signals.abilityCount,
    topLevelTypes: signals.topLevelTypes,
    triggerEvents: triggerEvents.sort(),
    effectFamilies: signals.effectFamilies,
    keywords: signals.keywords,
  };
}

export function summarizeAbilityForExpected(summary: AbilitySummary): string {
  const topLevel = summary.topLevelTypes.join(", ") || "none";
  const triggers = summary.triggerEvents.join(", ") || "none";
  const effects = summary.effectFamilies.join(", ") || "none";
  const keywords = summary.keywords.join(", ") || "none";

  return `count=${summary.abilityCount}; top=${topLevel}; triggers=${triggers}; effects=${effects}; keywords=${keywords}`;
}
