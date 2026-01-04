import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaGlovesOff: CharacterCard = {
  id: "77o",
  cardType: "character",
  name: "Elsa",
  version: "Gloves Off",
  fullName: "Elsa - Gloves Off",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  text: "Challenger +3 (While challenging, this character gets +3 {S})",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  externalIds: {
    ravensburger: "19ff66fcdff2f3666e276f89a192f746b49b256b",
  },
  abilities: [
    {
      id: "77o-1",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};
