import type { ActionCard } from "@tcg/lorcana-types";

export const iWillFindMyWay: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
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
