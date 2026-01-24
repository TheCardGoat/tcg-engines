import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineImperiousQueen: CharacterCard = {
  id: "1ir",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Imperious Queen",
  fullName: "Lady Tremaine - Imperious Queen",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 110,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c555de0cc0c5618aef6420094f6b4d9e52c30313",
  },
  abilities: [
    {
      id: "1ir-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
};
