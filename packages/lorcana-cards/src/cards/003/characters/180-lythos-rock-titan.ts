import type { CharacterCard } from "@tcg/lorcana-types";

export const lythosRockTitan: CharacterCard = {
  id: "ae9",
  cardType: "character",
  name: "Lythos",
  version: "Rock Titan",
  fullName: "Lythos - Rock Titan",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Resist +2 (Damage dealt to this character is reduced by 2.)\nSTONE SKIN {E} — Chosen character gains Resist +2 this turn.",
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 1,
  cardNumber: 180,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2577f4cffb832d0b016b61a458da02cb03a8fb23",
  },
  abilities: [
    {
      id: "ae9-1",
      type: "keyword",
      keyword: "Resist",
      value: 2,
      text: "Resist +2",
    },
    {
      id: "ae9-2",
      type: "activated",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      text: "STONE SKIN {E} — Chosen character gains Resist +2 this turn.",
    },
  ],
  classifications: ["Storyborn", "Titan"],
};
