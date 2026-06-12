import type { CharacterCard } from "@tcg/lorcana-types";
import { mrBigShrewdTycoonI18n } from "./174-mr-big-shrewd-tycoon.i18n";

export const mrBigShrewdTycoon: CharacterCard = {
  id: "05m",
  canonicalId: "ci_05m",
  reprints: ["set6-174"],
  cardType: "character",
  name: "Mr. Big",
  version: "Shrewd Tycoon",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 174,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 1,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_0b5dcdce945a404395b6c65a894ecf6d",
    tcgPlayer: 593029,
  },
  text: [
    {
      title: "REPUTATION",
      description: "This character can't be challenged by characters with 2 {S} or more.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
        challengerFilter: {
          type: "strength-comparison",
          operator: "gte",
          value: 2,
        },
      },
      id: "1lm-1",
      name: "REPUTATION",
      text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
      type: "static",
    },
  ],
  i18n: mrBigShrewdTycoonI18n,
};
