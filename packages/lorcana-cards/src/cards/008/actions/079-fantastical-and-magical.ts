import type { ActionCard } from "@tcg/lorcana-types";

export const fantasticalAndMagical: ActionCard = {
  abilities: [
    {
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
      id: "1nt-1",
      text: "Sing Together 9 For each character that sang this song, draw a card and gain 1 lore.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 79,
  cardType: "action",
  cost: 9,
  externalIds: {
    ravensburger: "d4a4aaa05c1e118b809f40d219cd3f634c4ccc44",
  },
  franchise: "Encanto",
  id: "1nt",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Fantastical and Magical",
  set: "008",
  text: "Sing Together 9 For each character that sang this song, draw a card and gain 1 lore.",
};
