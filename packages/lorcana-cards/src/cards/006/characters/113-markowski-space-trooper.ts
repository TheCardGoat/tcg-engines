import type { CharacterCard } from "@tcg/lorcana";

export const markowskiSpaceTrooper: CharacterCard = {
  id: "1t3",
  cardType: "character",
  name: "Markowski",
  version: "Space Trooper",
  fullName: "Markowski - Space Trooper",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  externalIds: {
    ravensburger: "ead46bfd3bf059ae7fe97fb6163a498b70b7e8a7",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1t3-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
