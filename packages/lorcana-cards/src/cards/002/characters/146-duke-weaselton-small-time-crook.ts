import type { CharacterCard } from "@tcg/lorcana";

export const dukeWeaseltonSmalltimeCrook: CharacterCard = {
  id: "1e8",
  cardType: "character",
  name: "Duke Weaselton",
  version: "Small-Time Crook",
  fullName: "Duke Weaselton - Small-Time Crook",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cardNumber: "146",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "b51612597f56a105b1d978244f4cde86b568d13e",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "1e8-ability-1",
      text: "Ward (Opponents can't choose this character except to challenge.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn"],
};
