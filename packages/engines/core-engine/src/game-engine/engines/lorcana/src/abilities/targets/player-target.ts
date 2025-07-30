import type { BaseTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";

export interface PlayerTarget extends BaseTarget {
  type: "player";
  value?: "self" | "opponent" | "any" | "owner" | "all"; // Player targets can be self or opponent
}

export const selfPlayerTarget: PlayerTarget = {
  type: "player",
  value: "self",
};

export const youPlayerTarget: PlayerTarget = selfPlayerTarget;

export const targetOwnerTarget: PlayerTarget = {
  type: "player",
  value: "owner",
};

export const chosenOpponentTarget: PlayerTarget = {
  type: "player",
  value: "opponent",
};

export const allOpponentsTarget: PlayerTarget = {
  type: "player",
  value: "opponent",
  targetAll: true,
};

export const eachOpponentTarget: PlayerTarget = allOpponentsTarget;

export const chosenPlayerTarget: PlayerTarget = {
  type: "player",
  value: "any",
};

export const eachPlayerTarget: PlayerTarget = {
  type: "player",
  value: "all",
  targetAll: true,
};
