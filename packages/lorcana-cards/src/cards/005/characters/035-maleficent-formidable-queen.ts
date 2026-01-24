import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentFormidableQueen: CharacterCard = {
  id: "1a2",
  cardType: "character",
  name: "Maleficent",
  version: "Formidable Queen",
  fullName: "Maleficent - Formidable Queen",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Maleficent.)\nLISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
  cost: 8,
  strength: 7,
  willpower: 7,
  lore: 2,
  cardNumber: 35,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "04a79bb0eca187a8b814a8086f523827a8495e69",
  },
  abilities: [
    {
      id: "1a2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
      text: "Shift 6",
    },
    {
      id: "1a2-2",
      type: "action",
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
      text: "LISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
};
