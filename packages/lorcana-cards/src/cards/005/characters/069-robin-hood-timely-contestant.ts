import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodTimelyContestant: CharacterCard = {
  id: "jfv",
  cardType: "character",
  name: "Robin Hood",
  version: "Timely Contestant",
  fullName: "Robin Hood - Timely Contestant",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.\nWard (Opponents can't choose this character except to challenge.)",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  cardNumber: 69,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "46113126c7bad0cd90cc18033e9413118fc1ccb1",
  },
  abilities: [
    {
      id: "jfv-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
    },
    {
      id: "jfv-2",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
