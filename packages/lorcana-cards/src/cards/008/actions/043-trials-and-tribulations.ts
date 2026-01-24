import type { ActionCard } from "@tcg/lorcana-types";

export const trialsAndTribulations: ActionCard = {
  id: "1o4",
  cardType: "action",
  name: "Trials and Tribulations",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "008",
  text: "Chosen character gets -4 {S} until the start of your next turn.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 43,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d8ad24fab25df6002c32c0d56047eab14acd94c4",
  },
  abilities: [
    {
      id: "1o4-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -4,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Chosen character gets -4 {S} until the start of your next turn.",
    },
  ],
};
