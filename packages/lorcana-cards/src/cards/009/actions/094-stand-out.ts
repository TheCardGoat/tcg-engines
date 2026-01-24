import type { ActionCard } from "@tcg/lorcana-types";

export const standOut: ActionCard = {
  id: "1gf",
  cardType: "action",
  name: "Stand Out",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 94,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bed4e9a5870bd978e803e8b8939fe601e61b1b04",
  },
  abilities: [
    {
      id: "1gf-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 3,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "SELF",
          },
        ],
      },
      text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
    },
  ],
};
