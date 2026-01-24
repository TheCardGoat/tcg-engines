import type { CharacterCard } from "@tcg/lorcana-types";

export const madameMedusaTheBoss: CharacterCard = {
  id: "162",
  cardType: "character",
  name: "Madame Medusa",
  version: "The Boss",
  fullName: "Madame Medusa - The Boss",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "003",
  text: "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 112,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "979f3dc046126dfc16cd552ce9c772ada607ad11",
  },
  abilities: [
    {
      id: "162-1",
      type: "triggered",
      name: "THAT TERRIBLE WOMAN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
