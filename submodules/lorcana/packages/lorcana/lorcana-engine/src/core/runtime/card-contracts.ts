import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

/**
 * The card definition type used throughout the Lorcana engine runtime.
 *
 * Now that generic type parameters have been removed from the embedded core,
 * this is hardcoded to LorcanaCardDefinition.
 */
export type BaseCardDefinition = LorcanaCardDefinition;

/**
 * Minimal runtime metadata shape attached to card instances.
 */
export type BaseCardMeta = Record<string, unknown>;
