import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonPureParagon: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "z5u-1",
      text: "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.",
      type: "action",
    },
    {
      id: "z5u-2",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
  ],
  cardNumber: 119,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 9,
  externalIds: {
    ravensburger: "7eba1c3fb054cfff5aef1939f5af90cdc29a1977",
  },
  franchise: "Beauty and the Beast",
  fullName: "Gaston - Pure Paragon",
  id: "z5u",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Gaston",
  set: "005",
  strength: 10,
  text: "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.\nRush (This character can challenge the turn they're played.)",
  version: "Pure Paragon",
  willpower: 6,
};
