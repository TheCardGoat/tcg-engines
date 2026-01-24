import type { CharacterCard } from "@tcg/lorcana-types";

export const pepaMadrigalSensitiveSister: CharacterCard = {
  id: "1km",
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Sensitive Sister",
  fullName: "Pepa Madrigal - Sensitive Sister",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cc1aa602cb2089e854c848bf55d994adcbf44b15",
  },
  abilities: [
    {
      id: "1km-1",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
