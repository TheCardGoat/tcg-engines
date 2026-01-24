import type { ActionCard } from "@tcg/lorcana-types";

export const fantasticalAndMagical: ActionCard = {
  id: "1nt",
  cardType: "action",
  name: "Fantastical and Magical",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "008",
  text: "Sing Together 9 For each character that sang this song, draw a card and gain 1 lore.",
  actionSubtype: "song",
  cost: 9,
  cardNumber: 79,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d4a4aaa05c1e118b809f40d219cd3f634c4ccc44",
  },
  abilities: [
    {
      id: "1nt-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "Sing Together 9 For each character that sang this song, draw a card and gain 1 lore.",
    },
  ],
};
