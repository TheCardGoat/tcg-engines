import type { CharacterCard } from "@tcg/lorcana-types";

export const zipperFlyingRanger: CharacterCard = {
  id: "8ix",
  cardType: "character",
  name: "Zipper",
  version: "Flying Ranger",
  fullName: "Zipper - Flying Ranger",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "008",
  text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 192,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1eb9f5705effae96f1ba3a5ce437b333dcba62bc",
  },
  abilities: [
    {
      id: "8ix-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Monterey Jack in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
    },
    {
      id: "8ix-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
