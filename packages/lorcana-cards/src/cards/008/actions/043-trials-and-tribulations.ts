import type { ActionCard } from "@tcg/lorcana-types";

export const trialsAndTribulations: ActionCard = {
  abilities: [
    {
      effect: {
        modifier: -4,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1o4-1",
      text: "Chosen character gets -4 {S} until the start of your next turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 43,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "d8ad24fab25df6002c32c0d56047eab14acd94c4",
  },
  franchise: "Princess and the Frog",
  id: "1o4",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Trials and Tribulations",
  set: "008",
  text: "Chosen character gets -4 {S} until the start of your next turn.",
};
