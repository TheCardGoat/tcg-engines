import type { ActionCard } from "@tcg/lorcana-types";

export const promisingLead: ActionCard = {
  id: "19l",
  cardType: "action",
  name: "Promising Lead",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  cardNumber: 162,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a44ddfb28ff8435ece31f42c92d599f64a90165f",
  },
  abilities: [
    {
      id: "19l-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
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
            keyword: "Support",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "Chosen character gets +1 {L} and gains Support this turn.",
    },
  ],
};
