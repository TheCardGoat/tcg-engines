import type { ActionCard } from "@tcg/lorcana-types";

export const hesATramp: ActionCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "1mv-1",
      text: "Chosen character gets +1 {S} this turn for each character you have in play.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 117,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "d2e7b04e55be924e0bc9c07444cacc89c38ba255",
  },
  franchise: "Lady and the Tramp",
  id: "1mv",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "He's a Tramp",
  set: "007",
  text: "Chosen character gets +1 {S} this turn for each character you have in play.",
};
