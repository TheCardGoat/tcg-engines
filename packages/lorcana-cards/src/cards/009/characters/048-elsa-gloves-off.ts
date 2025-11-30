import type { CharacterCard } from "@tcg/lorcana";

export const elsaGlovesOff: CharacterCard = {
  id: "77o",
  cardType: "character",
  name: "Elsa",
  version: "Gloves Off",
  fullName: "Elsa - Gloves Off",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  text: "Challenger +3 (While challenging, this character gets +3.)",
  cardNumber: "048",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "19ff66fcdff2f3666e276f89a192f746b49b256b",
  },
  keywords: [
    {
      type: "Challenger",
      value: 3,
    },
  ],
  abilities: [
    {
      id: "77oa1",
      text: "Challenger +3",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};
