import type { CharacterCard } from "@tcg/lorcana-types";

export const marianoGuzmanHandsomeSuitor: CharacterCard = {
  id: "15v",
  cardType: "character",
  name: "Mariano Guzman",
  version: "Handsome Suitor",
  fullName: "Mariano Guzman - Handsome Suitor",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  text: "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 16,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "96e9154811d25333627f2c164557f25cf35abeae",
  },
  abilities: [
    {
      id: "15v-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
