import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";

export const youHaveLocationInPlay: Condition = {
  type: "filter",
  comparison: { operator: "gte", value: 1 },
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "location" },
    { filter: "zone", value: "play" },
  ],
};

export const haveCardsInDeck: Condition = {
  type: "filter",
  comparison: { operator: "gte", value: 1 },
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "deck" },
  ],
};

export const youHaveItemInPlay: Condition = {
  type: "filter",
  comparison: { operator: "gte", value: 1 },
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "play" },
    { filter: "type", value: "item" },
  ],
};

export const youHaveDealtDamageToOpposingCharacterThisTurn: Condition = {
  type: "this-turn",
  value: "was-damaged",
  target: "self",
  comparison: { operator: "gte", value: 1 },
  filters: [
    { filter: "owner", value: "opponent" },
    { filter: "type", value: "character" },
    { filter: "zone", value: ["discard", "play"] },
  ],
};
