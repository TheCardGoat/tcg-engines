import type { CharacterCard } from "@tcg/lorcana-types";
import { jimHawkinsHonorablePirateI18n } from "./025-jim-hawkins-honorable-pirate.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const jimHawkinsHonorablePirate: CharacterCard = {
  id: "I2f",
  canonicalId: "ci_I2f",
  reprints: ["set6-025"],
  cardType: "character",
  name: "Jim Hawkins",
  version: "Honorable Pirate",
  inkType: ["amber"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 25,
  rarity: "common",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5de4864e187a4039b3e47b6ada93b801",
    tcgPlayer: 578171,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "HIRE A CREW",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    bodyguard,
    {
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 4,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "classification",
                classification: "Pirate",
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
      id: "1el-2",
      name: "HIRE A CREW",
      text: "HIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jimHawkinsHonorablePirateI18n,
};
