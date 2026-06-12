import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellSnowflakeCollectorI18n } from "./048-tinker-bell-snowflake-collector.i18n";

export const tinkerBellSnowflakeCollector: CharacterCard = {
  id: "AqR",
  canonicalId: "ci_AqR",
  reprints: ["set11-048"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Snowflake Collector",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "011",
  cardNumber: 48,
  rarity: "legendary",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_52cd7cdc36254654b13e484e2dbc989e",
    tcgPlayer: 673332,
  },
  text: [
    {
      title: "FLURRY OF DELIGHT",
      description: "While you have 4 or more cards in your hand, this character gains Evasive.",
    },
    {
      title: "SPECTACULAR FIND",
      description: "While you have 7 or more cards in your hand, this character gets +3 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Fairy"],
  abilities: [
    {
      id: "t9a-1",
      name: "FLURRY OF DELIGHT",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "greater-or-equal",
        value: 4,
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      text: "FLURRY OF DELIGHT While you have 4 or more cards in your hand, this character gains Evasive.",
    },
    {
      id: "t9a-2",
      name: "SPECTACULAR FIND",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "greater-or-equal",
        value: 7,
      },
      effect: {
        modifier: 3,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "SPECTACULAR FIND While you have 7 or more cards in your hand, this character gets +3 {L}.",
    },
  ],
  i18n: tinkerBellSnowflakeCollectorI18n,
};
