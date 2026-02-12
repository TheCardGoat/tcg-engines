import type { ActionCard } from "@tcg/lorcana-types";

export const promisingLead: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "19l-1",
      text: "Chosen character gets +1 {L} and gains Support this turn.",
      type: "action",
    },
  ],
  cardNumber: 162,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "a44ddfb28ff8435ece31f42c92d599f64a90165f",
  },
  franchise: "Zootropolis",
  id: "19l",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Promising Lead",
  set: "010",
  text: "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};
