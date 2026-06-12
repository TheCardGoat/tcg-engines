import type { ItemCard } from "@tcg/lorcana-types";
import { retroEvolutionDeviceI18n } from "./100-retro-evolution-device.i18n";

export const retroEvolutionDevice: ItemCard = {
  id: "WNZ",
  canonicalId: "ci_WNZ",
  reprints: ["set11-100"],
  cardType: "item",
  name: "Retro Evolution Device",
  inkType: ["emerald"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 100,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7afac820f8249d9896e3cc693fe0094",
    tcgPlayer: 675393,
  },
  text: [
    {
      title: "TURN INTO DINOSAUR",
      description:
        "{E}, 1 {I}, Banish chosen character of yours — Play a character with cost up to 2 more than the banished character for free.",
    },
  ],
  abilities: [
    {
      id: "1bs-1",
      name: "TURN INTO DINOSAUR",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "play-card",
              from: "hand",
              cardType: "character",
              cost: "free",
              filter: {
                maxCost: {
                  type: "chosen-card-cost",
                  offset: 2,
                },
              },
            },
          },
        ],
      },
      text: "TURN INTO DINOSAUR {E}, 1 {I}, Banish chosen character of yours — Play a character with cost up to 2 more than the banished character for free.",
    },
  ],
  i18n: retroEvolutionDeviceI18n,
};
