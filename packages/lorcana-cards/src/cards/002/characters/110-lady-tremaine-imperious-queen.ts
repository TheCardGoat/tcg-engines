import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineImperiousQueen: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1ir-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
  ],
  cardNumber: 110,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen"],
  cost: 6,
  externalIds: {
    ravensburger: "c555de0cc0c5618aef6420094f6b4d9e52c30313",
  },
  franchise: "Cinderella",
  fullName: "Lady Tremaine - Imperious Queen",
  id: "1ir",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Lady Tremaine",
  set: "002",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.",
  version: "Imperious Queen",
  willpower: 4,
};
