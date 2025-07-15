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
 * Builds multiple abilities from parsed clauses
 */
export function buildAbilitiesFromClauses(
  clauses: ParsedClause[],
  config: AbilityBuilderConfig = {},
): GundamAbility[] {
  const abilities: GundamAbility[] = [];

  for (const clause of clauses) {
    if (clause.effects.length === 0) {
      if (config.debug) {
        console.log(
          `[Ability Builder] Skipping clause with no effects: "${clause.text}"`,
        );
      }
      continue;
    }

    try {
      // Handle different clause types
      if (clause.type === "modal") {
        const modalAbility = buildModalAbilityFromClause(clause, config);
        if (modalAbility) {
          abilities.push(modalAbility);
        }
      } else if (clause.type === "condition" || clause.type === "timing") {
        const triggeredAbility = buildTriggeredAbilityFromClause(
          clause,
          config,
        );
        if (triggeredAbility) {
          abilities.push(triggeredAbility);
        }
      } else {
        // Standard resolution ability
        const ability = buildResolutionAbilityFromEffects(
          clause.effects,
          config,
        );

        // Add clause text
        if (clause.text) {
          ability.text = clause.text;
        }

        abilities.push(ability);
      }
    } catch (error) {
      if (config.debug) {
        console.error(
          `[Ability Builder] Failed to build ability from clause: "${clause.text}"`,
          error,
        );
      }
      // Continue processing other clauses
    }
  }

  return abilities;
}

/**
 * Builds a modal ability from a modal clause
 */
export function buildModalAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): ResolutionAbility | null {
  if (clause.type !== "modal" || clause.effects.length === 0) {
    return null;
  }

  // For a real implementation, we would parse out the modal options
  // For now, create a placeholder modal effect
  const modalOptions = [
    { type: "placeholder", text: "Option 1" },
    { type: "placeholder", text: "Option 2" },
  ];

  const modalEffect = createModalEffect(modalOptions);

  return createResolutionAbility([modalEffect], {
    text: clause.text,
    optional: true,
  });
}

/**
 * Builds a triggered ability from a condition or timing clause
 */
export function buildTriggeredAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): TriggeredAbility | null {
  if (
    !(clause.type === "condition" || clause.type === "timing") ||
    clause.effects.length === 0
  ) {
    return null;
  }

  // Convert parsed effects to actual effects
  const effects = clause.effects.map((effect) =>
    createEffectFromParsed(effect),
  );

  // Determine trigger type based on clause text
  let eventType = "unknown";
  let duration;

  if (
    clause.text.includes("end of turn") ||
    clause.text.includes("end of your turn")
  ) {
    eventType = "end_of_turn";
  } else if (
    clause.text.includes("beginning of turn") ||
    clause.text.includes("beginning of your turn")
  ) {
    eventType = "beginning_of_turn";
  } else if (clause.text.includes("when this unit is destroyed")) {
    eventType = "on_destroy";
  } else if (clause.text.includes("when this unit attacks")) {
    eventType = "on_attack";
  } else if (clause.text.includes("when this unit is deployed")) {
    eventType = "on_deploy";
  }

  // Check for duration markers
  if (
    clause.text.includes("until end of turn") ||
    clause.text.includes("this turn")
  ) {
    duration = "turn";
  } else if (clause.text.includes("until your next turn")) {
    duration = "next_turn";
  }

  return createTriggeredAbility(
    effects,
    { event: eventType },
    {
      text: clause.text,
      duration,
    },
  );
}

/**
 * Determines if a keyword should be represented as a continuous ability
 */
export function isKeywordContinuous(keyword: GundamKeyword): boolean {
  // Most Gundam keywords are continuous abilities
  return [
    "Repair",
    "Breach",
    "Support",
    "Blocker",
    "Rush",
    "Pierce",
    "Intercept",
    "Stealth",
  ].includes(keyword);
}

/**
 * Builds a keyword ability
 */
export function buildKeywordAbility(
  keyword: GundamKeyword,
  value?: number,
): GundamAbility {
  // For most keywords, create a continuous ability
  if (isKeywordContinuous(keyword)) {
    return {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword,
          value,
        },
      ],
      text: `<${keyword}${value ? ` ${value}` : ""}>`,
    };
  }

  // For triggered keywords, create appropriate triggered ability
  // This is just a placeholder - implement based on actual keyword mechanics
  return {
    type: "triggered",
    effects: [
      {
        type: "keyword",
        keyword,
        value,
      },
    ],
    trigger: { event: "custom" },
    text: `<${keyword}${value ? ` ${value}` : ""}>`,
  };
}
