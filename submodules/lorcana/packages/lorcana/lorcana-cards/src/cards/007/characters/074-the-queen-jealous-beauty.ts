import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenJealousBeautyI18n } from "./074-the-queen-jealous-beauty.i18n";

export const theQueenJealousBeauty: CharacterCard = {
  id: "J3O",
  canonicalId: "ci_J3O",
  reprints: ["set7-074"],
  cardType: "character",
  name: "The Queen",
  version: "Jealous Beauty",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  cardNumber: 74,
  rarity: "legendary",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_db45bcd9604d43b3b9a430ee1f23bec8",
    tcgPlayer: 619446,
  },
  text: [
    {
      title: "NO ORDINARY APPLE",
      description:
        "{E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "ce7-1",
      name: "NO ORDINARY APPLE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-on-bottom",
            target: {
              selector: "chosen",
              count: {
                exactly: 3,
              },
              owner: "opponent",
              zones: ["discard"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "returned-card-is-princess",
            },
            then: {
              type: "gain-lore",
              amount: 4,
              target: "CONTROLLER",
            },
            else: {
              type: "gain-lore",
              amount: 3,
              target: "CONTROLLER",
            },
          },
        ],
      },
      text: "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
    },
  ],
  i18n: theQueenJealousBeautyI18n,
};
