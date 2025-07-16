// Ability Builder for Gundam Text Parser
// Assembles parsed effects into complete ability structures

import { createEffectFromParsed, createModalEffect } from "./effect-factory";
import type { GundamKeyword, ParsedClause, ParsedEffect } from "./types";

// Define ability types to match what the engine would use
// These will need to be replaced with actual engine types when they're available

/**
 * Base ability interface
 */
interface GundamAbility {
  type: string;
  effects: any[];
  text?: string;
  id?: string;
  trigger?: any; // Added to support triggered abilities
}

/**
 * Resolution ability (standard ability)
 */
interface ResolutionAbility extends GundamAbility {
  type: "resolution";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
  optional?: boolean;
}

/**
 * Triggered ability
 */
interface TriggeredAbility extends GundamAbility {
  type: "triggered";
  trigger: {
    event: string;
    condition?: any;
  };
  duration?: string;
}

/**
 * Continuous ability
 */
interface ContinuousAbility extends GundamAbility {
  type: "continuous";
  duration?: string;
}

/**
 * Configuration for ability building
 */
export interface AbilityBuilderConfig {
  debug?: boolean;
  defaultResponder?: "self" | "opponent";
  resolveEffectsIndividually?: boolean;
}

/**
 * Analyzes parsed effects to determine if they should be dependent
 */
export function detectDependentEffects(effects: ParsedEffect[]): boolean {
  if (effects.length <= 1) return false;

  // Look for dependency indicators in effect parameters
  for (let i = 1; i < effects.length; i++) {
    const effect = effects[i];

    // Check if effect parameters reference previous effects
    if (effect && effect.parameters && effect.parameters.dependsOnPrevious) {
      return true;
    }

    // Check for common dependency patterns in text
    const dependencyKeywords = ["then", "that", "it", "them"];

    if (effect && effect.parameters && effect.parameters.originalText) {
      const text = effect.parameters.originalText.toLowerCase();
      if (dependencyKeywords.some((keyword) => text.includes(keyword))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Determines if effects should resolve individually
 */
export function shouldResolveEffectsIndividually(
  effects: ParsedEffect[],
): boolean {
  if (effects.length <= 1) return false;

  // Check if effects have different targets
  const targets = effects.map((effect) => effect.target);
  const uniqueTargets = new Set(
    targets.map((target) => JSON.stringify(target)),
  );

  if (uniqueTargets.size > 1) {
    return true;
  }

  // Check if effects have different types that typically resolve individually
  const individualTypes = ["damage", "draw", "destroy", "deploy"];
  const hasIndividualTypes = effects.some((effect) =>
    individualTypes.includes(effect.type),
  );

  if (hasIndividualTypes && effects.length > 1) {
    return true;
  }

  // Check for timing differences
  const durations = effects.map((effect) => effect.duration).filter(Boolean);
  if (durations.length > 0 && durations.length !== effects.length) {
    return true;
  }

  return false;
}

/**
 * Creates a basic resolution ability from a list of effects
 */
export function createResolutionAbility(
  effects: any[],
  options: {
    text?: string;
    optional?: boolean;
    dependentEffects?: boolean;
    resolveEffectsIndividually?: boolean;
  } = {},
): ResolutionAbility {
  return {
    type: "resolution",
    effects,
    ...options,
  };
}

/**
 * Builds a resolution ability from parsed effects
 */
export function buildResolutionAbilityFromEffects(
  parsedEffects: ParsedEffect[],
  config: AbilityBuilderConfig = {},
): ResolutionAbility {
  if (parsedEffects.length === 0) {
    throw new Error("Cannot build ability from empty effects array");
  }

  // Convert parsed effects to actual effects
  const effects = parsedEffects.map((effect) => createEffectFromParsed(effect));

  // Analyze effects for configuration
  const dependentEffects = detectDependentEffects(parsedEffects);
  const resolveIndividually =
    config.resolveEffectsIndividually ??
    shouldResolveEffectsIndividually(parsedEffects);

  if (config.debug) {
    console.log(
      `[Ability Builder] Building ability with ${effects.length} effects`,
    );
    console.log(`[Ability Builder] Dependent effects: ${dependentEffects}`);
    console.log(
      `[Ability Builder] Resolve individually: ${resolveIndividually}`,
    );
  }

  return createResolutionAbility(effects, {
    dependentEffects,
    resolveEffectsIndividually: resolveIndividually,
  });
}

/**
 * Creates a triggered ability
 */
export function createTriggeredAbility(
  effects: any[],
  trigger: { event: string; condition?: any },
  options: {
    text?: string;
    duration?: string;
  } = {},
): TriggeredAbility {
  return {
    type: "triggered",
    effects,
    trigger,
    ...options,
  };
}

/**
 * Creates a continuous ability
 */
export function createContinuousAbility(
  effects: any[],
  options: {
    text?: string;
    duration?: string;
  } = {},
): ContinuousAbility {
  return {
    type: "continuous",
    effects,
    ...options,
  };
}

/**
 * Builds multiple abilities from parsed clauses
 */
export function buildAbilitiesFromClauses(
  clauses: ParsedClause[],
  config: AbilityBuilderConfig = {},
): GundamAbility[] {
  const abilities: GundamAbility[] = [];

  // First, identify timing markers which typically indicate triggered abilities
  const timingClauses = clauses.filter((clause) => clause.type === "timing");
  const timingMarkers = timingClauses
    .map((clause) => {
      const markerMatch = clause.text.match(/【([^】]+)】/);
      return markerMatch ? markerMatch[1]?.trim().toLowerCase() : null;
    })
    .filter(Boolean);

  // Group clauses by timing markers
  const triggerGroups: Record<
    string,
    { trigger: string; clauses: ParsedClause[] }
  > = {};

  // Initialize groups with known timing markers
  timingMarkers.forEach((marker) => {
    if (marker) {
      triggerGroups[marker] = {
        trigger: marker,
        clauses: [],
      };
    }
  });

  // Assign clauses to their respective timing groups
  let currentTiming: string | null = null;

  for (const clause of clauses) {
    // If this is a timing marker, set it as the current timing
    if (clause.type === "timing") {
      const markerMatch = clause.text.match(/【([^】]+)】/);
      if (markerMatch) {
        currentTiming = markerMatch[1]?.trim().toLowerCase() || null;
      }
    }
    // If we have a current timing and this is not a timing clause, add it to that group
    else if (currentTiming && triggerGroups[currentTiming]) {
      triggerGroups[currentTiming].clauses.push(clause);
    }
  }

  // Process standalone keyword clauses (not associated with timing)
  const keywordClauses = clauses.filter(
    (clause) => clause.type === "keyword" && clause.effects.length > 0,
  );

  // Create continuous abilities for standalone keywords
  for (const keywordClause of keywordClauses) {
    const effects = keywordClause.effects.map((effect) =>
      createEffectFromParsed(effect),
    );

    const continuousAbility = createContinuousAbility(effects, {
      text: keywordClause.text,
    });

    abilities.push(continuousAbility);
  }

  // Create triggered abilities from timing groups
  for (const [trigger, group] of Object.entries(triggerGroups)) {
    // Get all effects from the clauses in this group
    const effects = group.clauses
      .flatMap((clause) => clause.effects)
      .map((effect) => createEffectFromParsed(effect));

    // If we have effects or timing type indicates we should create ability anyway
    if (
      effects.length > 0 ||
      ["deploy", "burst", "when-paired", "when-destroyed"].includes(
        trigger.toLowerCase().replace(/\s+/g, "-"),
      )
    ) {
      // For empty effects, create a placeholder if needed
      const finalEffects =
        effects.length > 0
          ? effects
          : [{ type: "placeholder", parameters: {} }];

      const triggeredAbility = createTriggeredAbility(
        finalEffects,
        { event: trigger.toLowerCase().replace(/\s+/g, "-") },
        { text: `【${trigger}】` },
      );

      abilities.push(triggeredAbility);
    }
  }

  // Process remaining effect clauses not associated with triggers
  // Exclude rule clauses (parenthetical text) from creating standalone abilities
  const remainingEffectClauses = clauses.filter(
    (clause) =>
      clause.type === "effect" &&
      clause.effects.length > 0 &&
      !clause.text.match(/^\([^)]*\)$/) && // Exclude parenthetical rule text
      !Object.values(triggerGroups).some((group) =>
        group.clauses.includes(clause),
      ),
  );

  // If we have standalone effect clauses, create resolution abilities
  if (remainingEffectClauses.length > 0) {
    const effects = remainingEffectClauses
      .flatMap((clause) => clause.effects)
      .map((effect) => createEffectFromParsed(effect));

    // Analyze effects for configuration
    const dependentEffects = detectDependentEffects(
      remainingEffectClauses.flatMap((c) => c.effects),
    );
    const resolveIndividually =
      config.resolveEffectsIndividually ??
      shouldResolveEffectsIndividually(
        remainingEffectClauses.flatMap((c) => c.effects),
      );

    // Create a resolution ability
    const resolutionAbility = createResolutionAbility(effects, {
      text: remainingEffectClauses.map((c) => c.text).join(" "),
      dependentEffects,
      resolveEffectsIndividually: resolveIndividually,
    });

    abilities.push(resolutionAbility);
  }

  // Handle modal clauses separately
  const modalClauses = clauses.filter((clause) => clause.type === "modal");
  for (const modalClause of modalClauses) {
    const modalAbility = buildModalAbilityFromClause(modalClause, config);
    if (modalAbility) {
      abilities.push(modalAbility);
    }
  }

  if (config.debug) {
    console.log(`[Ability Builder] Created ${abilities.length} abilities`);
    abilities.forEach((ability, i) => {
      console.log(
        `[Ability Builder] Ability ${i + 1}: ${ability.type} with ${ability.effects.length} effects`,
      );
    });
  }

  return abilities;
}

export function buildModalAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): ResolutionAbility | null {
  if (!clause.effects || clause.effects.length === 0) {
    return null;
  }

  // For modal clauses, we typically need to create a modal effect
  // that contains all the possible options
  const effects = clause.effects.map((effect) =>
    createEffectFromParsed(effect),
  );

  const modalAbility = createResolutionAbility([createModalEffect(effects)], {
    text: clause.text,
    optional: true, // Modal choices are typically optional
  });

  return modalAbility;
}

export function buildTriggeredAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): TriggeredAbility | null {
  if (!clause.effects || clause.effects.length === 0) {
    return null;
  }

  // Extract trigger information from the clause type and text
  const triggerInfo = extractTriggerInfo(clause);
  if (!triggerInfo) {
    if (config.debug) {
      console.warn(
        `[Ability Builder] Failed to extract trigger info from clause: "${clause.text}"`,
      );
    }
    return null;
  }

  const effects = clause.effects.map((effect) =>
    createEffectFromParsed(effect),
  );

  const triggeredAbility = createTriggeredAbility(effects, triggerInfo, {
    text: clause.text,
  });

  return triggeredAbility;
}

/**
 * Extracts trigger information from a clause
 */
function extractTriggerInfo(
  clause: ParsedClause,
): { event: string; condition?: any } | null {
  // This is a simplified version - in a real implementation,
  // we would parse the clause text and extract the trigger type and conditions

  // Look for common trigger patterns in the text
  const deployPattern = /【Deploy】/;
  const attackPattern = /【Attack】/;
  const burstPattern = /【Burst】/;
  const pairedPattern = /【When Paired】/;
  const duringPairPattern = /【During Pair】/;
  const destroyedPattern = /【When Destroyed】/;
  const mainPattern = /【Main】/;
  const actionPattern = /【Action】/;

  if (deployPattern.test(clause.text)) {
    return { event: "deploy" };
  }
  if (attackPattern.test(clause.text)) {
    return { event: "attack" };
  }
  if (burstPattern.test(clause.text)) {
    return { event: "burst" };
  }
  if (pairedPattern.test(clause.text)) {
    return { event: "when-paired" };
  }
  if (duringPairPattern.test(clause.text)) {
    return { event: "during-pair" };
  }
  if (destroyedPattern.test(clause.text)) {
    return { event: "when-destroyed" };
  }
  if (mainPattern.test(clause.text)) {
    return { event: "main" };
  }
  if (actionPattern.test(clause.text)) {
    return { event: "action" };
  }

  // If no specific trigger is identified, return a generic trigger
  // based on the clause type
  if (clause.type === "condition") {
    return { event: "condition" };
  }
  if (clause.type === "timing") {
    return { event: "timing" };
  }

  return null;
}

/**
 * Determines if a keyword should be treated as a continuous ability
 */
export function isKeywordContinuous(keyword: GundamKeyword): boolean {
  // These keywords are inherently continuous
  const continuousKeywords = [
    "Repair",
    "Breach",
    "Support",
    "Blocker",
    "Rush",
    "Pierce",
    "Intercept",
    "Stealth",
  ];

  return continuousKeywords.includes(keyword);
}

/**
 * Builds a keyword ability (typically continuous)
 */
export function buildKeywordAbility(
  keyword: GundamKeyword,
  value?: number,
): GundamAbility {
  // Create the keyword effect
  const keywordEffect = {
    type: "keyword",
    keyword,
    value,
  };

  // Keywords are typically continuous abilities
  return createContinuousAbility([keywordEffect], {
    text: value ? `<${keyword} ${value}>` : `<${keyword}>`,
  });
}
