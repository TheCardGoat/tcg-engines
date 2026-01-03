import type { ActionCard } from "@tcg/lorcana-types";

export const ControlYourTemperUndefined: ActionCard = {
  id: "eny",
  cardType: "action",
  name: "Control Your Temper!",
  version: "undefined",
  fullName: "Control Your Temper! - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "Chosen character gets -2 {S} this turn.",
  cost: 1,
  cardNumber: 26,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "eny-1",
      text: "Chosen character gets -2 {S} this turn.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
    },
  ],
};
