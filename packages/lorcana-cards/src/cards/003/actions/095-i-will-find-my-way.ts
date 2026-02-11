import type { ActionCard } from "@tcg/lorcana-types";

export const iWillFindMyWay: ActionCard = {
  abilities: [
    {
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
      id: "wyf-1",
      text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 95,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "76c72f7c7ca88688d326fb41bcac4308a48a724a",
  },
  franchise: "Hercules",
  id: "wyf",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "I Will Find My Way",
  set: "003",
  text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
};
