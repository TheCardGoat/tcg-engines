import type { InstanceId, PlayerId, PublicCardId } from "./ids.js";

/**
 * Per-match instance map. Same shape as `@tcg/shared/game-adapter`'s
 * `CardsMaps` — redefined here so this package has zero runtime deps on
 * `@tcg/shared`. Bridge by structural compatibility, not by import.
 */
export interface CardsMaps {
  cardInstances: Record<InstanceId, PublicCardId>;
  owners: Record<PlayerId, InstanceId[]>;
}
