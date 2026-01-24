import type { ActionCard } from "@tcg/lorcana-types";

export const dellasMoonLullaby: ActionCard = {
  id: "154",
  cardType: "action",
  name: "Della's Moon Lullaby",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 28,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "041d3dff81da0e22be26f50d6affa034c191634f",
  },
  abilities: [
    {
      id: "154-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
    },
  ],
};
