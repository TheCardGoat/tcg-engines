import type { CharacterCard } from "@tcg/lorcana-types";

export const lythosRockTitan: CharacterCard = {
  abilities: [
    {
      id: "ae9-1",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
    {
      cost: { exert: true },
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
      id: "ae9-2",
      text: "STONE SKIN {E} — Chosen character gains Resist +2 this turn.",
      type: "activated",
    },
  ],
  cardNumber: 180,
  cardType: "character",
  classifications: ["Storyborn", "Titan"],
  cost: 4,
  externalIds: {
    ravensburger: "2577f4cffb832d0b016b61a458da02cb03a8fb23",
  },
  franchise: "Hercules",
  fullName: "Lythos - Rock Titan",
  id: "ae9",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Lythos",
  set: "003",
  strength: 4,
  text: "Resist +2 (Damage dealt to this character is reduced by 2.)\nSTONE SKIN {E} — Chosen character gains Resist +2 this turn.",
  version: "Rock Titan",
  willpower: 1,
};
