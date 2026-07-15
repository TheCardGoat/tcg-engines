import type { CharacterCard } from "@tcg/lorcana-types";

export const zipperFlyingRanger: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character named Monterey Jack in play",
          type: "if",
        },
        then: {
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "8ix-1",
      text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "8ix-2",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "1eb9f5705effae96f1ba3a5ce437b333dcba62bc",
  },
  franchise: "Rescue Rangers",
  fullName: "Zipper - Flying Ranger",
  id: "8ix",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Zipper",
  set: "008",
  strength: 2,
  text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Flying Ranger",
  willpower: 4,
};
