import type { CharacterCard } from "@tcg/lorcana-types";

export const maximusTeamChampion: CharacterCard = {
  id: "p5e",
  cardType: "character",
  name: "Maximus",
  version: "Team Champion",
  fullName: "Maximus - Team Champion",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "005",
  text: "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 105,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5aa4a5a95aa496e560025d060007f42140401cae",
  },
  abilities: [
    {
      id: "p5e-1",
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "gain-lore",
            amount: 2,
          },
          {
            type: "gain-lore",
            amount: 5,
          },
        ],
        optionLabels: [
          "if you have any characters in play with 5 {S}",
          "more, gain 2 lore. If you have any in play with 10 {S}",
          "more, gain 5 lore instead.",
        ],
      },
      text: "ROYALLY BIG REWARDS At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
