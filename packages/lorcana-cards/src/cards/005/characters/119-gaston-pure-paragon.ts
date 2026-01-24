import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonPureParagon: CharacterCard = {
  id: "z5u",
  cardType: "character",
  name: "Gaston",
  version: "Pure Paragon",
  fullName: "Gaston - Pure Paragon",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.\nRush (This character can challenge the turn they're played.)",
  cost: 9,
  strength: 10,
  willpower: 6,
  lore: 2,
  cardNumber: 119,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "7eba1c3fb054cfff5aef1939f5af90cdc29a1977",
  },
  abilities: [
    {
      id: "z5u-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.",
    },
    {
      id: "z5u-2",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
