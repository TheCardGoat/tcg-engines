import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodTimelyContestant: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "jfv-1",
      text: "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      id: "jfv-2",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 9,
  externalIds: {
    ravensburger: "46113126c7bad0cd90cc18033e9413118fc1ccb1",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Timely Contestant",
  id: "jfv",
  inkType: ["emerald"],
  inkable: false,
  lore: 4,
  missingTests: true,
  name: "Robin Hood",
  set: "005",
  strength: 6,
  text: "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.\nWard (Opponents can't choose this character except to challenge.)",
  version: "Timely Contestant",
  willpower: 6,
};
