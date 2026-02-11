import type { ActionCard } from "@tcg/lorcana-types";

export const controlYourTemperundefined: ActionCard = {
  abilities: [
    {
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
      id: "eny-1",
      text: "Chosen character gets -2 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 26,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Control Your Temper! - undefined",
  id: "eny",
  inkType: ["amber"],
  inkable: true,
  name: "Control Your Temper!",
  set: "001",
  text: "Chosen character gets -2 {S} this turn.",
  version: "undefined",
};
