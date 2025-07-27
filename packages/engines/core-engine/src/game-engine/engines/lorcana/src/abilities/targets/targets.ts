import type { CardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";

export interface BaseTarget {
  type: "card" | "player";
  targetAll?: boolean;
}

export interface PlayerTarget extends BaseTarget {
  type: "player";
  value?: "self" | "opponent" | "any"; // Player targets can be self or opponent
}

export type AbilityTarget = PlayerTarget | CardTarget;
