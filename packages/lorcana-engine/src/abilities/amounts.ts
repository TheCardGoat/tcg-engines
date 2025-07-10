import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";

export interface DynamicAmount {
  dynamic: true;
  amount?: number;
  getAmountFromTrigger?: boolean;
  // Uses target card as reference
  target?: { attribute: "strength" | "lore" | "damage" | "cost" };
  // uses source card as reference
  sourceAttribute?: "strength" | "lore" | "damage" | "chars-at-location";
  // Uses the target's location card as reference
  targetLocation?: { attribute: "lore" };
  excludeSelf?: boolean; // Exclude the target card from the filter count
  filters?: TargetFilter[];
  filterMultiplier?: number;
  // TODO: Find a better name later
  // This is for Clarabelle's ability, that requires a difference from two filters
  difference?: TargetFilter[] | number;
  // TODO: This name sucks - But this is for each damage on opposing characters
  targetFilterReducer?: "damage";
}

export const forEachItemYouHaveInPlay: DynamicAmount = {
  dynamic: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "item" },
    { filter: "owner", value: "self" },
  ],
};

export const forEachCharYouHaveInPlay: DynamicAmount = {
  dynamic: true,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ],
};

export const forEachCardInYourHand: DynamicAmount = {
  dynamic: true,
  filters: [
    { filter: "zone", value: "hand" },
    { filter: "owner", value: "self" },
  ],
};

export const forEachCardInYourDiscard: DynamicAmount = {
  dynamic: true,
  filters: [
    { filter: "zone", value: "discard" },
    { filter: "owner", value: "self" },
  ],
};

export const allCardsInYourDeck: DynamicAmount = {
  dynamic: true,
  filters: [
    { filter: "zone", value: "deck" },
    { filter: "owner", value: "self" },
  ],
};
