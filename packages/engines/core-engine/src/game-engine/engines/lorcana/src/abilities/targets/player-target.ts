import type { BaseTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";

export interface PlayerTarget extends BaseTarget {
  type: "player";
  value?: "self" | "opponent" | "any" | "owner"; // Player targets can be self or opponent
}

export const selfPlayerTarget: PlayerTarget = {
  type: "player",
  value: "self",
};

export const targetOwnerTarget: PlayerTarget = {
  type: "player",
  value: "owner",
};
