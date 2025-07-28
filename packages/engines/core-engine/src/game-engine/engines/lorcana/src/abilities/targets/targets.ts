import type { CardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";

export interface BaseTarget {
  type: "card" | "player";
  targetAll?: boolean;
}

export type AbilityTarget = PlayerTarget | CardTarget;

// Re-export the individual target types
export type { CardTarget, PlayerTarget };
