import type { CharacterCard } from "@tcg/lorcana-types";

export const marianoGuzmanHandsomeSuitor: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "15v-1",
      text: "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "96e9154811d25333627f2c164557f25cf35abeae",
  },
  franchise: "Encanto",
  fullName: "Mariano Guzman - Handsome Suitor",
  id: "15v",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mariano Guzman",
  set: "007",
  strength: 3,
  text: "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
  version: "Handsome Suitor",
  willpower: 4,
};
