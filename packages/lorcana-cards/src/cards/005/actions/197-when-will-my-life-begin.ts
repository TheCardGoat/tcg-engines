import type { ActionCard } from "@tcg/lorcana-types";

export const whenWillMyLifeBegin: ActionCard = {
  id: "1ay",
  cardType: "action",
  name: "When Will My Life Begin?",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "005",
  text: "Chosen character can't challenge during their next turn. Draw a card.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 197,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a93a1efecc6c3e773ca5de295729482697c34e24",
  },
  abilities: [
    {
      id: "1ay-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "SELF",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Chosen character can't challenge during their next turn. Draw a card.",
    },
  ],
};
