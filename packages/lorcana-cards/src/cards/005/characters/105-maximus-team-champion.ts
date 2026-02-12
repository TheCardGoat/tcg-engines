import type { CharacterCard } from "@tcg/lorcana-types";

export const maximusTeamChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        optionLabels: [
          "if you have any characters in play with 5 {S}",
          "more, gain 2 lore. If you have any in play with 10 {S}",
          "more, gain 5 lore instead.",
        ],
        options: [
          {
            from: "hand",
            type: "play-card",
          },
          {
            amount: 2,
            type: "gain-lore",
          },
          {
            amount: 5,
            type: "gain-lore",
          },
        ],
        type: "choice",
      },
      id: "p5e-1",
      text: "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.",
      type: "action",
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "5aa4a5a95aa496e560025d060007f42140401cae",
  },
  franchise: "Tangled",
  fullName: "Maximus - Team Champion",
  id: "p5e",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maximus",
  set: "005",
  strength: 3,
  text: "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.",
  version: "Team Champion",
  willpower: 5,
};
