import type { ActionCard } from "@tcg/lorcana-types";

export const butImMuchFaster: ActionCard = {
  id: "1dr",
  cardType: "action",
  name: "But I'm Much Faster",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "010",
  text: "Chosen character gains Alert and Challenger +2 this turn. (They can challenge as if they had Evasive. They get +2 {S} while challenging.)",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 195,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b29939d6950700c806a94a667d1390dc2de54fd2",
  },
  abilities: [
    {
      id: "1dr-1",
      type: "action",
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
      text: "Chosen character gains Alert and Challenger +2 this turn.",
    },
  ],
};
