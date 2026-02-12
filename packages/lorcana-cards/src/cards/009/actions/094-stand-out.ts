import type { ActionCard } from "@tcg/lorcana-types";

export const standOut: ActionCard = {
  abilities: [
    {
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
      id: "1gf-1",
      text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 94,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "bed4e9a5870bd978e803e8b8939fe601e61b1b04",
  },
  franchise: "Goofy Movie",
  id: "1gf",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Stand Out",
  set: "009",
  text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
};
