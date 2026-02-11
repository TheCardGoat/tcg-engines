import type { CharacterCard } from "@tcg/lorcana-types";

export const pepaMadrigalSensitiveSister: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1km-1",
      text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 3,
  externalIds: {
    ravensburger: "cc1aa602cb2089e854c848bf55d994adcbf44b15",
  },
  franchise: "Encanto",
  fullName: "Pepa Madrigal - Sensitive Sister",
  id: "1km",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pepa Madrigal",
  set: "007",
  strength: 2,
  text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
  version: "Sensitive Sister",
  willpower: 4,
};
