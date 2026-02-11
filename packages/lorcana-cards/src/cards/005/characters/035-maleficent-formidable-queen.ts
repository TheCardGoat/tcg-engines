import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentFormidableQueen: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "1a2-1",
      keyword: "Shift",
      text: "Shift 6",
      type: "keyword",
    },
    {
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1a2-2",
      text: "LISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
  cost: 8,
  externalIds: {
    ravensburger: "04a79bb0eca187a8b814a8086f523827a8495e69",
  },
  franchise: "Sleeping Beauty",
  fullName: "Maleficent - Formidable Queen",
  id: "1a2",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Maleficent",
  set: "005",
  strength: 7,
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Maleficent.)\nLISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
  version: "Formidable Queen",
  willpower: 7,
};
