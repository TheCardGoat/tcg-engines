import type { CharacterCard } from "@tcg/lorcana-types";
import { bullseyeLoyalHorseI18n } from "./017-bullseye-loyal-horse.i18n";

export const bullseyeLoyalHorse: CharacterCard = {
  id: "1zQ",
  canonicalId: "ci_1zQ",
  reprints: ["set12-017"],
  cardType: "character",
  name: "Bullseye",
  version: "Loyal Horse",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 17,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_029d768f40084d1ca1f66a01a5e6981e",
  },
  text: [
    {
      title: "LET'S RIDE",
      description:
        "If you have a character named Woody or Jessie in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "1zQ-1",
      name: "LET'S RIDE",
      condition: {
        type: "or",
        conditions: [
          {
            type: "has-named-character",
            controller: "you",
            name: "Woody",
          },
          {
            type: "has-named-character",
            controller: "you",
            name: "Jessie",
          },
        ],
      },
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      sourceZones: ["hand"],
      type: "static",
      text: "LET'S RIDE If you have a character named Woody or Jessie in play, you pay 1 {I} less to play this character.",
    },
  ],
  i18n: bullseyeLoyalHorseI18n,
};
