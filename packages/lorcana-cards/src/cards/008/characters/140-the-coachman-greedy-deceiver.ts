import type { CharacterCard } from "@tcg/lorcana-types";

export const theCoachmanGreedyDeceiver: CharacterCard = {
  abilities: [
    {
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
      id: "1ym-1",
      text: "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 140,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "fe8f963a16dbcc2a2786f70afc4ac7042a25a0d2",
  },
  franchise: "Pinocchio",
  fullName: "The Coachman - Greedy Deceiver",
  id: "1ym",
  inkType: ["ruby", "steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Coachman",
  set: "008",
  strength: 2,
  text: "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive. (Only characters with Evasive can challenge them.)",
  version: "Greedy Deceiver",
  willpower: 2,
};
