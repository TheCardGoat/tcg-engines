// Ability Builder System for Action Text Parser
// Assembles individual effects into ResolutionAbility structures

import type {
  FloatingTriggeredAbility,
  ResolutionAbility,
  TriggeredAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { Trigger } from "@lorcanito/lorcana-engine/abilities/triggers";
import type {
  Effect,
  ModalEffect,
  ModalEffectMode,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import { createEffectFromParsed } from "./effect-factory";
import type { ParsedClause, ParsedEffect } from "./types";

/**
 * Configuration options for ability building
 */
export interface AbilityBuilderConfig {
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Default responder for abilities */
  defaultResponder?: "self" | "opponent";
  /** Whether to resolve effects individually by default */
  resolveEffectsIndividually?: boolean;
}

/**
 * Analyzes parsed effects to determine if they should be dependent
 * Effects are dependent if they reference results from previous effects
 */
export function detectDependentEffects(effects: ParsedEffect[]): boolean {
  if (effects.length <= 1) {
    return false;
  }

  // Look for dependency indicators in effect text or parameters
  for (let i = 1; i < effects.length; i++) {
    const effect = effects[i];

    // Check if effect parameters reference previous effects
    if (effect && effect.parameters && effect.parameters.dependsOnPrevious) {
      return true;
    }

    // Check for common dependency patterns in text
    const dependencyKeywords = [
      "then",
      "that",
      "it",
      "them",
      "chosen",
      "selected",
      "targeted",
    ];

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
 * Determines if effects should be resolved individually
 * This is typically true when effects target different objects or have different timing
 */
export function shouldResolveEffectsIndividually(
  effects: ParsedEffect[],
): boolean {
  if (effects.length <= 1) {
    return false;
  }

  // Check if effects have different targets
  const targets = effects.map((effect) => effect.target);
  const uniqueTargets = new Set(
    targets.map((target) => JSON.stringify(target)),
  );

  if (uniqueTargets.size > 1) {
    return true;
  }

  // Check if effects have different types that typically resolve individually
  const individualTypes = ["draw", "damage", "banish", "move"];
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
 * Analyzes effects to determine if the ability is detrimental
 * Detrimental abilities typically involve negative effects like damage or banishing
 */
export function isDetrimentalAbility(effects: ParsedEffect[]): boolean {
  const detrimentalTypes = ["damage", "banish", "discard"];
  return effects.some((effect) => detrimentalTypes.includes(effect.type));
}

/**
 * Creates a basic ResolutionAbility from a list of effects
 */
export function createResolutionAbility(
  effects: Effect[],
  options: {
    name?: string;
    text?: string;
    optional?: boolean;
    responder?: "self" | "opponent";
    resolveEffectsIndividually?: boolean;
    dependentEffects?: boolean;
    detrimental?: boolean;
  } = {},
): ResolutionAbility {
  return {
    type: "resolution",
    effects,
    ...options,
  };
}

/**
 * Builds a ResolutionAbility from parsed effects with automatic dependency detection
 */
export function buildResolutionAbilityFromEffects(
  parsedEffects: ParsedEffect[],
  config: AbilityBuilderConfig = {},
): ResolutionAbility {
  if (parsedEffects.length === 0) {
    throw new Error("Cannot build ability from empty effects array");
  }

  // Convert parsed effects to actual effects
  const effects = parsedEffects.map(createEffectFromParsed);

  // Analyze effects for automatic configuration
  const dependentEffects = detectDependentEffects(parsedEffects);
  const resolveIndividually =
    config.resolveEffectsIndividually ??
    shouldResolveEffectsIndividually(parsedEffects);
  const detrimental = isDetrimentalAbility(parsedEffects);

  if (config.debug) {
    console.log(
      `[Ability Builder] Building ability with ${effects.length} effects`,
    );
    console.log(`[Ability Builder] Dependent effects: ${dependentEffects}`);
    console.log(
      `[Ability Builder] Resolve individually: ${resolveIndividually}`,
    );
    console.log(`[Ability Builder] Detrimental: ${detrimental}`);
  }

  return createResolutionAbility(effects, {
    responder: config.defaultResponder,
    resolveEffectsIndividually: resolveIndividually,
    dependentEffects,
    detrimental,
  });
}

/**
 * Builds multiple ResolutionAbilities from parsed clauses
 * Each clause typically becomes a separate ability
 */
export function buildAbilitiesFromClauses(
  clauses: ParsedClause[],
  config: AbilityBuilderConfig = {},
): ResolutionAbility[] {
  const abilities: ResolutionAbility[] = [];

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
      const ability = buildResolutionAbilityFromEffects(clause.effects, config);

      // Add clause-specific information
      if (clause.text) {
        ability.text = clause.text;
      }

      abilities.push(ability);
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
 * Combines multiple effects into a single ResolutionAbility when appropriate
 * This is used for effects that should be part of the same ability
 */
export function combineEffectsIntoSingleAbility(
  parsedEffects: ParsedEffect[],
  config: AbilityBuilderConfig = {},
): ResolutionAbility {
  return buildResolutionAbilityFromEffects(parsedEffects, config);
}

/**
 * Determines if multiple clauses should be combined into a single ability
 * This happens when clauses are connected by "then" or similar conjunctions
 */
export function shouldCombineClauses(clauses: ParsedClause[]): boolean {
  if (clauses.length <= 1) {
    return false;
  }

  // Check for dependency relationships
  for (const clause of clauses) {
    if (clause.dependencies && clause.dependencies.length > 0) {
      return true;
    }
  }

  // Check for sequential indicators in clause types
  const hasSequentialTypes = clauses.some(
    (clause) => clause.type === "condition" || clause.type === "timing",
  );

  return hasSequentialTypes;
}

/**
 * Main function to build abilities from parsed clauses with intelligent grouping
 */
export function buildAbilitiesWithGrouping(
  clauses: ParsedClause[],
  config: AbilityBuilderConfig = {},
): ResolutionAbility[] {
  if (clauses.length === 0) {
    return [];
  }

  // If clauses should be combined, create a single ability
  if (shouldCombineClauses(clauses)) {
    const allEffects = clauses.flatMap((clause) => clause.effects);
    if (allEffects.length > 0) {
      // Mark effects as dependent when combining clauses with dependencies
      const hasDependencies = clauses.some(
        (clause) => clause.dependencies && clause.dependencies.length > 0,
      );
      if (hasDependencies) {
        // Add dependency markers to effects for proper detection
        allEffects.forEach((effect, index) => {
          if (index > 0) {
            effect.parameters = {
              ...effect.parameters,
              dependsOnPrevious: true,
            };
          }
        });
      }

      const combinedAbility = combineEffectsIntoSingleAbility(
        allEffects,
        config,
      );

      // Combine text from all clauses
      const combinedText = clauses.map((clause) => clause.text).join(" ");
      if (combinedText) {
        combinedAbility.text = combinedText;
      }

      return [combinedAbility];
    }
  }

  // Otherwise, build separate abilities for each clause
  return buildAbilitiesFromClauses(clauses, config);
}
/**
 * Creates a modal effect mode from parsed effects
 */
export function createModalEffectMode(
  id: string,
  text: string,
  parsedEffects: ParsedEffect[],
  options: {
    optional?: boolean;
    resolveEffectsIndividually?: boolean;
    responder?: "self" | "opponent";
  } = {},
): ModalEffectMode {
  const effects = parsedEffects.map(createEffectFromParsed);

  return {
    id,
    text,
    effects,
    ...options,
  };
}

/**
 * Creates a modal effect from multiple modes
 */
export function createModalEffect(
  modes: ModalEffectMode[],
  target?: any, // TODO: Fix target type when the engine removes the target requirement
): ModalEffect {
  return {
    type: "modal",
    modes,
    // TODO: Remove this when the engine no longer requires target for modal effects
    target: target || { type: "card", value: "all", filters: [] },
  };
}

/**
 * Parses modal options from text and creates corresponding modes
 */
export function parseModalOptions(
  optionsText: string,
  config: AbilityBuilderConfig = {},
): { modes: ModalEffectMode[]; errors: string[] } {
  const modes: ModalEffectMode[] = [];
  const errors: string[] = [];

  // Split options by "or" separator
  const optionTexts = optionsText
    .split(/\s+or\s+/i)
    .map((option) => option.trim())
    .filter((option) => option.length > 0);

  if (optionTexts.length === 0) {
    errors.push("No modal options found in text");
    return { modes, errors };
  }

  for (let i = 0; i < optionTexts.length; i++) {
    const optionText = optionTexts[i];
    const modeId = (i + 1).toString();

    try {
      // For now, create a simple mode with placeholder effects
      // In a full implementation, this would parse the option text into actual effects
      const mode: ModalEffectMode = {
        id: modeId,
        text: optionText || "", // Ensure text is never undefined
        effects: [], // TODO: Parse option text into actual effects
      };

      modes.push(mode);

      if (config.debug) {
        console.log(`[Modal Parser] Created mode ${modeId}: "${optionText}"`);
      }
    } catch (error) {
      const errorMsg = `Failed to parse modal option "${optionText}": ${error}`;
      errors.push(errorMsg);

      if (config.debug) {
        console.error(`[Modal Parser] ${errorMsg}`);
      }
    }
  }

  return { modes, errors };
}

/**
 * Creates a ResolutionAbility with modal effects from parsed modal clause
 */
export function buildModalAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): { ability?: ResolutionAbility; errors: string[] } {
  const errors: string[] = [];

  if (clause.type !== "modal") {
    errors.push(`Expected modal clause, got ${clause.type}`);
    return { errors };
  }

  // Extract modal information from clause
  // Since ParsedClause doesn't have a parameters property, we'll extract from effects or use defaults
  const modalType = "Choose one"; // Default modal type

  // Try to extract options text from the clause text or effects
  let optionsText = "";
  if (clause.effects && clause.effects.length > 0) {
    // Try to get options text from the first effect's parameters
    const firstEffect = clause.effects[0];
    if (firstEffect && firstEffect.parameters) {
      if ("optionsText" in firstEffect.parameters) {
        optionsText = firstEffect.parameters.optionsText as string;
      } else if ("remainingText" in firstEffect.parameters) {
        optionsText = firstEffect.parameters.remainingText as string;
      }
    }
  }

  // If we still don't have options text, try to extract from clause text
  if (!optionsText && clause.text) {
    // Extract options from the clause text by removing "Choose one:" prefix
    const match = clause.text.match(/^Choose one:?\s*(.*)/i);
    if (match && match[1] && match[1].trim()) {
      optionsText = match[1].trim();
    }
    // Don't fall back to clause.text if it's just "Choose one:" without options
  }

  if (!optionsText) {
    errors.push("No modal options text found in clause");
    return { errors };
  }

  // Parse the modal options
  const { modes, errors: parseErrors } = parseModalOptions(optionsText, config);
  errors.push(...parseErrors);

  if (modes.length === 0) {
    errors.push("No valid modal modes could be created");
    return { errors };
  }

  // Create the modal effect
  const modalEffect = createModalEffect(modes);

  // Create the resolution ability
  const ability = createResolutionAbility([modalEffect], {
    text: clause.text,
    responder: config.defaultResponder,
  });

  if (config.debug) {
    console.log(
      `[Modal Builder] Created modal ability with ${modes.length} modes`,
    );
  }

  return { ability, errors };
}

/**
 * Determines if a clause represents a modal effect
 */
export function isModalClause(clause: ParsedClause): boolean {
  return clause.type === "modal" ||
    (clause.text && /\bchoose\s+(?:one|two|three|\d+):/i.test(clause.text))
    ? true
    : false;
}

/**
 * Builds abilities from clauses, handling modal effects appropriately
 */
export function buildAbilitiesWithModalSupport(
  clauses: ParsedClause[],
  config: AbilityBuilderConfig = {},
): { abilities: ResolutionAbility[]; errors: string[] } {
  const abilities: ResolutionAbility[] = [];
  const errors: string[] = [];

  for (const clause of clauses) {
    if (isModalClause(clause)) {
      // Handle modal clause
      const { ability, errors: modalErrors } = buildModalAbilityFromClause(
        clause,
        config,
      );
      errors.push(...modalErrors);

      if (ability) {
        abilities.push(ability);
      }
    } else if (clause.effects.length > 0) {
      // Handle regular clause
      try {
        const ability = buildResolutionAbilityFromEffects(
          clause.effects,
          config,
        );
        if (clause.text) {
          ability.text = clause.text;
        }
        abilities.push(ability);
      } catch (error) {
        const errorMsg = `Failed to build ability from clause: ${error}`;
        errors.push(errorMsg);

        if (config.debug) {
          console.error(`[Ability Builder] ${errorMsg}`);
        }
      }
    }
  }

  return { abilities, errors };
}
/**
 * Creates a delayed triggered ability for "at the end of turn" effects
 */
export function createDelayedTriggeredAbility(
  parsedEffects: ParsedEffect[],
  options: {
    name?: string;
    text?: string;
    optional?: boolean;
    detrimental?: boolean;
    resolveEffectsIndividually?: boolean;
  } = {},
): TriggeredAbility {
  const effects = parsedEffects.map(createEffectFromParsed);

  return atTheEndOfYourTurn({
    effects,
    ...options,
  });
}

/**
 * Creates a floating triggered ability for "whenever" effects
 */
export function createFloatingTriggeredAbility(
  parsedEffects: ParsedEffect[],
  trigger: Trigger,
  options: {
    text?: string;
    duration?: "turn" | "next_turn";
  } = {},
): FloatingTriggeredAbility {
  const effects = parsedEffects.map(createEffectFromParsed);

  const layer: ResolutionAbility = {
    type: "resolution",
    effects,
    text: options.text,
  };

  return {
    type: "floating-triggered",
    trigger,
    duration: options.duration || "turn",
    layer,
    text: options.text,
  };
}

/**
 * Determines if a clause represents a delayed triggered ability
 */
export function isDelayedTriggeredClause(clause: ParsedClause): boolean {
  if (clause.type === "timing") {
    return true;
  }

  // Check for timing markers in text
  const timingPatterns = [
    /\bat the end of (?:your|the) turn\b/i,
    /\bat the beginning of (?:your|the) turn\b/i,
    /\bnext turn\b/i,
  ];

  return clause.text
    ? timingPatterns.some((pattern) => pattern.test(clause.text))
    : false;
}

/**
 * Determines if a clause represents a floating triggered ability
 */
export function isFloatingTriggeredClause(clause: ParsedClause): boolean {
  if (clause.type === "condition") {
    return true;
  }

  // Check for trigger keywords in text
  const triggerPatterns = [/\bwhenever\b/i, /\bwhen\b/i, /\bif\b/i];

  return clause.text
    ? triggerPatterns.some((pattern) => pattern.test(clause.text))
    : false;
}

/**
 * Parses timing information from clause text to determine trigger timing
 */
export function parseTimingFromClause(clause: ParsedClause): {
  isEndOfTurn: boolean;
  isStartOfTurn: boolean;
  isNextTurn: boolean;
  duration?: "turn" | "next_turn";
} {
  const text = clause.text?.toLowerCase() || "";

  const isEndOfTurn = /\bat the end of (?:your|the) turn\b/.test(text);
  const isStartOfTurn = /\bat the beginning of (?:your|the) turn\b/.test(text);
  const isNextTurn = /\bnext turn\b/.test(text);

  let duration: "turn" | "next_turn" | undefined;
  if (isNextTurn) {
    duration = "next_turn";
  } else if (isEndOfTurn || isStartOfTurn) {
    duration = "turn";
  }

  return {
    isEndOfTurn,
    isStartOfTurn,
    isNextTurn,
    duration,
  };
}

/**
 * Creates a basic trigger from clause text (placeholder implementation)
 */
export function createTriggerFromClause(clause: ParsedClause): Trigger | null {
  const text = clause.text?.toLowerCase() || "";

  // This is a simplified implementation - in a full parser, this would be more sophisticated
  if (text.includes("whenever") || text.includes("when")) {
    // For now, return a generic end turn trigger as placeholder
    // In a full implementation, this would parse the specific trigger condition
    return {
      on: "end_turn" as const,
      target: self,
    };
  }

  return null;
}

/**
 * Builds a delayed triggered ability from a timing clause
 */
export function buildDelayedTriggeredAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): { ability?: TriggeredAbility; errors: string[] } {
  const errors: string[] = [];

  if (!isDelayedTriggeredClause(clause)) {
    errors.push(`Clause is not a delayed triggered ability: "${clause.text}"`);
    return { errors };
  }

  if (clause.effects.length === 0) {
    errors.push("No effects found in delayed triggered clause");
    return { errors };
  }

  const timing = parseTimingFromClause(clause);

  if (!(timing.isEndOfTurn || timing.isStartOfTurn)) {
    errors.push("Could not determine timing for delayed triggered ability");
    return { errors };
  }

  try {
    const ability = createDelayedTriggeredAbility(clause.effects, {
      text: clause.text,
      detrimental: isDetrimentalAbility(clause.effects),
      resolveEffectsIndividually: shouldResolveEffectsIndividually(
        clause.effects,
      ),
    });

    if (config.debug) {
      console.log(
        `[Triggered Builder] Created delayed triggered ability: "${clause.text}"`,
      );
    }

    return { ability, errors };
  } catch (error) {
    const errorMsg = `Failed to build delayed triggered ability: ${error}`;
    errors.push(errorMsg);
    return { errors };
  }
}

/**
 * Builds a floating triggered ability from a condition clause
 */
export function buildFloatingTriggeredAbilityFromClause(
  clause: ParsedClause,
  config: AbilityBuilderConfig = {},
): { ability?: FloatingTriggeredAbility; errors: string[] } {
  const errors: string[] = [];

  if (!isFloatingTriggeredClause(clause)) {
    errors.push(`Clause is not a floating triggered ability: "${clause.text}"`);
    return { errors };
  }

  if (clause.effects.length === 0) {
    errors.push("No effects found in floating triggered clause");
    return { errors };
  }

  const trigger = createTriggerFromClause(clause);
  if (!trigger) {
    errors.push("Could not create trigger from clause");
    return { errors };
  }

  const timing = parseTimingFromClause(clause);

  try {
    const ability = createFloatingTriggeredAbility(clause.effects, trigger, {
      text: clause.text,
      duration: timing.duration,
    });

    if (config.debug) {
      console.log(
        `[Triggered Builder] Created floating triggered ability: "${clause.text}"`,
      );
    }

    return { ability, errors };
  } catch (error) {
    const errorMsg = `Failed to build floating triggered ability: ${error}`;
    errors.push(errorMsg);
    return { errors };
  }
}

/**
 * Builds abilities from clauses, handling triggered abilities appropriately
 */
export function buildAbilitiesWithTriggeredSupport(
  clauses: ParsedClause[],
  config: AbilityBuilderConfig = {},
): {
  abilities: ResolutionAbility[];
  triggeredAbilities: TriggeredAbility[];
  floatingTriggeredAbilities: FloatingTriggeredAbility[];
  errors: string[];
} {
  const abilities: ResolutionAbility[] = [];
  const triggeredAbilities: TriggeredAbility[] = [];
  const floatingTriggeredAbilities: FloatingTriggeredAbility[] = [];
  const errors: string[] = [];

  for (const clause of clauses) {
    if (isModalClause(clause)) {
      // Handle modal clause
      const { ability, errors: modalErrors } = buildModalAbilityFromClause(
        clause,
        config,
      );
      errors.push(...modalErrors);

      if (ability) {
        abilities.push(ability);
      }
    } else if (isDelayedTriggeredClause(clause)) {
      // Handle delayed triggered clause
      const { ability, errors: triggeredErrors } =
        buildDelayedTriggeredAbilityFromClause(clause, config);
      errors.push(...triggeredErrors);

      if (ability) {
        triggeredAbilities.push(ability);
      }
    } else if (isFloatingTriggeredClause(clause)) {
      // Handle floating triggered clause
      const { ability, errors: floatingErrors } =
        buildFloatingTriggeredAbilityFromClause(clause, config);
      errors.push(...floatingErrors);

      if (ability) {
        floatingTriggeredAbilities.push(ability);
      }
    } else if (clause.effects.length > 0) {
      // Handle regular clause
      try {
        const ability = buildResolutionAbilityFromEffects(
          clause.effects,
          config,
        );
        if (clause.text) {
          ability.text = clause.text;
        }
        abilities.push(ability);
      } catch (error) {
        const errorMsg = `Failed to build ability from clause: ${error}`;
        errors.push(errorMsg);

        if (config.debug) {
          console.error(`[Ability Builder] ${errorMsg}`);
        }
      }
    }
  }

  return { abilities, triggeredAbilities, floatingTriggeredAbilities, errors };
}
