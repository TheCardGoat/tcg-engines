import type { ActionCard } from "@tcg/lorcana-types";

export const iWillFindMyWay: ActionCard = {
  id: "wyf",
  cardType: "action",
  name: "I Will Find My Way",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "003",
  text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 95,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "76c72f7c7ca88688d326fb41bcac4308a48a724a",
  },
  abilities: [
    {
      id: "wyf-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
    },
  ],
};
