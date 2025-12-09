import type { CharacterCard } from "@tcg/lorcana";

export const kaaSuspiciousSerpent: CharacterCard = {
  id: "xkn",
  cardType: "character",
  name: "Kaa",
  version: "Suspicious Serpent",
  fullName: "Kaa - Suspicious Serpent",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "790085a5369b1cc854dd2c964ca6e879be2e2a56",
  },
  abilities: [
    {
      id: "xkn-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
