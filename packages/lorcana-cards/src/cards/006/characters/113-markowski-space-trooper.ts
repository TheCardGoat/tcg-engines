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
  cardNumber: "113",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "ead46bfd3bf059ae7fe97fb6163a498b70b7e8a7",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1t3-ability-1",
      text: "Evasive (Only characters with Evasive can challenge this character.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
