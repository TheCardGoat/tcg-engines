import type { CharacterCard } from "@tcg/lorcana-types";

export const madameMedusaTheBoss: CharacterCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "banish",
      },
      id: "162-1",
      name: "THAT TERRIBLE WOMAN",
      text: "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 112,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "979f3dc046126dfc16cd552ce9c772ada607ad11",
  },
  franchise: "Rescuers",
  fullName: "Madame Medusa - The Boss",
  id: "162",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Madame Medusa",
  set: "003",
  strength: 4,
  text: "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.",
  version: "The Boss",
  willpower: 4,
};
