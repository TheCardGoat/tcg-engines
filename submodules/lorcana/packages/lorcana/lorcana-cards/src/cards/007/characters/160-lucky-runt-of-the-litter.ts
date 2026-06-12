import type { CharacterCard } from "@tcg/lorcana-types";
import { luckyRuntOfTheLitterI18n } from "./160-lucky-runt-of-the-litter.i18n";

export const luckyRuntOfTheLitter: CharacterCard = {
  id: "Kl0",
  canonicalId: "ci_Kl0",
  reprints: ["set7-160"],
  cardType: "character",
  name: "Lucky",
  version: "Runt of the Litter",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 160,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6f2802da6557456c8a34693d3650784f",
    tcgPlayer: 619498,
  },
  text: [
    {
      title: "FOLLOW MY VOICE",
      description:
        "Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 2,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "classification",
                classification: "Puppy",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "1qo-1",
      name: "FOLLOW MY VOICE",
      text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: luckyRuntOfTheLitterI18n,
};
