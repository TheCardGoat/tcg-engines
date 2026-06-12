import type { CharacterCard } from "@tcg/lorcana-types";
import { ticktockRelentlessCrocodileI18n } from "./191-tick-tock-relentless-crocodile.i18n";

export const ticktockRelentlessCrocodile: CharacterCard = {
  id: "33J",
  canonicalId: "ci_33J",
  reprints: ["set7-191"],
  cardType: "character",
  name: "Tick-Tock",
  version: "Relentless Crocodile",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "007",
  cardNumber: 191,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_64885a846c394abfa482aa6aa4a3711e",
    tcgPlayer: 619517,
  },
  text: [
    {
      title: "LOOKING FOR LUNCH",
      description:
        "During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      condition: {
        type: "and",
        conditions: [
          {
            type: "turn",
            whose: "your",
          },
          {
            type: "has-character-with-classification",
            classification: "Pirate",
            controller: "any",
          },
        ],
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1qn-1",
      name: "LOOKING FOR LUNCH",
      text: "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play.",
      type: "static",
    },
  ],
  i18n: ticktockRelentlessCrocodileI18n,
};
