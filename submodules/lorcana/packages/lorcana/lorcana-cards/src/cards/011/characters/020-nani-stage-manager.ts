import type { CharacterCard } from "@tcg/lorcana-types";
import { naniStageManagerI18n } from "./020-nani-stage-manager.i18n";

export const naniStageManager: CharacterCard = {
  id: "dBq",
  canonicalId: "ci_dBq",
  reprints: ["set11-020"],
  cardType: "character",
  name: "Nani",
  version: "Stage Manager",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 20,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_20232422b3314d02b054a923d610d81d",
    tcgPlayer: 674829,
  },
  text: [
    {
      title: "THAT'S YOUR CUE",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a character card with cost 2 or less and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "4fq-1",
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "cost",
                comparison: "lte",
                value: 2,
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
      name: "THAT'S YOUR CUE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "THAT'S YOUR CUE When you play this character, look at the top 4 cards of your deck. You may reveal a character card with cost 2 or less and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: naniStageManagerI18n,
};
