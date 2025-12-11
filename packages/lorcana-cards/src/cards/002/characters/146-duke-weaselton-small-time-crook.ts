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
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 146,
  inkable: true,
  externalIds: {
    ravensburger: "b51612597f56a105b1d978244f4cde86b568d13e",
  },
  abilities: [
    {
      id: "1e8-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn"],
};
