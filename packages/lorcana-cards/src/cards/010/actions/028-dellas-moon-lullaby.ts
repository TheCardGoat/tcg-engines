import type { ActionCard } from "@tcg/lorcana-types";

export const dellasMoonLullaby: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            modifier: -2,
            stat: "strength",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "154-1",
      text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 28,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "041d3dff81da0e22be26f50d6affa034c191634f",
  },
  franchise: "Ducktales",
  id: "154",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Della's Moon Lullaby",
  set: "010",
  text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
};
