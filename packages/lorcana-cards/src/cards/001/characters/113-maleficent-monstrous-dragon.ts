import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentmonstrousDragon: CharacterCard = {
  id: "gs4",
  cardType: "character",
  name: "Maleficent",
  version: "Monstrous Dragon",
  fullName: "Maleficent - Monstrous Dragon",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Dragon Fire** When you play this character, you may banish chosen character.",
  cost: 9,
  strength: 7,
  willpower: 5,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "b6l-1",
      text: "**MALEFICENT'S SCEPTER** You may banish chosen character.",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Dragon"],
};
