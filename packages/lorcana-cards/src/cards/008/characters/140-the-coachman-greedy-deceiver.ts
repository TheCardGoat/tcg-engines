import type { CharacterCard } from "@tcg/lorcana-types";

export const theCoachmanGreedyDeceiver: CharacterCard = {
  id: "1ym",
  cardType: "character",
  name: "The Coachman",
  version: "Greedy Deceiver",
  fullName: "The Coachman - Greedy Deceiver",
  inkType: ["ruby", "steel"],
  franchise: "Pinocchio",
  set: "008",
  text: "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive. (Only characters with Evasive can challenge them.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 140,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fe8f963a16dbcc2a2786f70afc4ac7042a25a0d2",
  },
  abilities: [
    {
      id: "1ym-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "SELF",
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "SELF",
          },
        ],
      },
      text: "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
