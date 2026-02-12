import type { ActionCard } from "@tcg/lorcana-types";

export const butImMuchFaster: ActionCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "1dr-1",
      text: "Chosen character gains Alert and Challenger +2 this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 195,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "b29939d6950700c806a94a667d1390dc2de54fd2",
  },
  franchise: "Aladdin",
  id: "1dr",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "But I'm Much Faster",
  set: "010",
  text: "Chosen character gains Alert and Challenger +2 this turn. (They can challenge as if they had Evasive. They get +2 {S} while challenging.)",
};
